from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from fastapi.testclient import TestClient

WORKSPACE_ROOT = Path(__file__).resolve().parents[3]
if str(WORKSPACE_ROOT) not in sys.path:
    sys.path.append(str(WORKSPACE_ROOT))

from chefkix.perception.service.app import app


def validate_service() -> dict:
    client = TestClient(app)
    health = client.get("/health")
    infer = client.post(
        "/infer",
        files={"file": ("egg_sample.jpg", b"sample-bytes", "image/jpeg")},
        data={"label_hint": "egg"},
    )
    metadata = client.get("/metadata")

    health_payload = health.json()
    infer_payload = infer.json()
    metadata_payload = metadata.json()

    assert health.status_code == 200
    assert infer.status_code == 200
    assert metadata.status_code == 200
    assert health_payload["status"] == "ok"
    assert health_payload["detector_loaded"] is True
    assert infer_payload["status"] == "DONE"
    assert infer_payload["detections"]
    assert infer_payload["detections"][0]["class_name"] == "egg"

    return {
        "status": "DONE",
        "health": health_payload,
        "infer": infer_payload,
        "metadata": metadata_payload,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the Phase 1 service contract.")
    parser.add_argument("--output", required=True, help="Path to write the machine-readable validation report.")
    args = parser.parse_args()

    report = validate_service()
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
