from __future__ import annotations

import hashlib
import io
import sys
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, File, Form, UploadFile
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from chefkix.perception.core import load_taxonomy


TAXONOMY_PATH = Path(__file__).resolve().parents[1] / "labels" / "taxonomy.yaml"
TAXONOMY = load_taxonomy(TAXONOMY_PATH)


class DetectionBox(BaseModel):
    class_id: int = Field(..., ge=0)
    class_name: str
    score: float = Field(..., ge=0.0, le=1.0)
    bbox: List[float]


class InferenceResponse(BaseModel):
    status: str
    detector_name: str
    ontology_name: str
    ontology_version: int
    detections: List[DetectionBox]
    note: str


class HealthResponse(BaseModel):
    status: str
    detector_loaded: bool
    ontology_name: str
    ontology_version: int


def choose_label(filename: str, label_hint: Optional[str]) -> Optional[str]:
    if label_hint:
        return label_hint.strip().lower().replace(" ", "_")
    stem = Path(filename).stem.lower().replace("-", "_")
    for canonical, spec in TAXONOMY.classes_by_name.items():
        aliases = [canonical, *spec.aliases]
        if any(alias.lower().replace(" ", "_") in stem for alias in aliases):
            return canonical
    return None


def smoke_detection(image_bytes: bytes, filename: str, label_hint: Optional[str]) -> InferenceResponse:
    digest = hashlib.sha1(image_bytes or filename.encode("utf-8")).hexdigest()
    candidate = choose_label(filename, label_hint)
    detections: List[DetectionBox] = []

    if candidate and candidate in TAXONOMY.classes_by_name:
        base = int(digest[:8], 16)
        x1 = float(base % 80)
        y1 = float((base // 7) % 80)
        x2 = x1 + 64.0
        y2 = y1 + 64.0
        spec = TAXONOMY.classes_by_name[candidate]
        detections.append(
            DetectionBox(
                class_id=spec.class_id,
                class_name=spec.name,
                score=0.93,
                bbox=[x1, y1, x2, y2],
            )
        )

    status = "DONE" if detections else "STUBBED"
    note = "smoke detector returned a deterministic label hint" if detections else "no label hint or filename alias matched"
    return InferenceResponse(
        status=status,
        detector_name="chefkix_smoke_detector",
        ontology_name=TAXONOMY.ontology_name,
        ontology_version=TAXONOMY.version,
        detections=detections,
        note=note,
    )


app = FastAPI(title="ChefKix Perception Phase 1", version="0.1.0")


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        detector_loaded=True,
        ontology_name=TAXONOMY.ontology_name,
        ontology_version=TAXONOMY.version,
    )


@app.get("/metadata")
def metadata() -> dict:
    return {
        "model_name": "chefkix_smoke_detector",
        "ontology_name": TAXONOMY.ontology_name,
        "ontology_version": TAXONOMY.version,
        "class_count": len(TAXONOMY.classes),
        "classes": [item.name for item in TAXONOMY.classes],
    }


@app.post("/infer", response_model=InferenceResponse)
async def infer(file: UploadFile = File(...), label_hint: Optional[str] = Form(None)) -> InferenceResponse:
    payload = await file.read()
    return smoke_detection(payload, file.filename or "upload.bin", label_hint)


@app.post("/infer-bytes", response_model=InferenceResponse)
async def infer_bytes(payload: bytes = File(...), label_hint: Optional[str] = Form(None)) -> InferenceResponse:
    return smoke_detection(payload, "upload.bin", label_hint)


def main() -> None:
    import uvicorn

    uvicorn.run("chefkix.perception.service.app:app", host="127.0.0.1", port=8000, reload=False)


if __name__ == "__main__":
    main()
