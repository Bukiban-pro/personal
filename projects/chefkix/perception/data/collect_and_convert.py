from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from chefkix.perception.core import (
    Taxonomy,
    canonicalize_label,
    deterministic_split,
    load_taxonomy,
    validate_bbox,
    write_json,
)


@dataclass
class NormalizationFailure:
    record_id: str
    reason: str
    source_name: str


def load_source_manifest(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_manifest(source_manifest: Dict[str, Any], taxonomy: Taxonomy) -> Dict[str, Any]:
    records: List[Dict[str, Any]] = []
    failures: List[NormalizationFailure] = []

    sources = source_manifest.get("sources", [])
    for source in sources:
        source_name = source.get("name", "unknown")
        for record in source.get("records", []):
            record_id = str(record.get("image_id") or record.get("id") or "")
            if not record_id:
                failures.append(NormalizationFailure(record_id="", reason="missing record id", source_name=source_name))
                continue

            annotations_out: List[Dict[str, Any]] = []
            for annotation in record.get("annotations", []):
                raw_label = str(annotation.get("class") or annotation.get("label") or "")
                canonical_label = canonicalize_label(raw_label, taxonomy)
                if canonical_label not in taxonomy.classes_by_name:
                    failures.append(
                        NormalizationFailure(
                            record_id=record_id,
                            reason=f"unknown class: {raw_label}",
                            source_name=source_name,
                        )
                    )
                    continue

                bbox = annotation.get("bbox") or []
                if not validate_bbox(bbox):
                    failures.append(
                        NormalizationFailure(
                            record_id=record_id,
                            reason="invalid bbox",
                            source_name=source_name,
                        )
                    )
                    continue

                annotations_out.append(
                    {
                        "class": canonical_label,
                        "class_id": taxonomy.classes_by_name[canonical_label].class_id,
                        "bbox": [float(value) for value in bbox],
                        "source_label": raw_label,
                    }
                )

            if not annotations_out:
                failures.append(
                    NormalizationFailure(record_id=record_id, reason="no valid annotations", source_name=source_name)
                )
                continue

            records.append(
                {
                    "record_id": record_id,
                    "image_path": record.get("image_path", ""),
                    "split": deterministic_split(record_id),
                    "source_name": source_name,
                    "annotations": annotations_out,
                }
            )

    split = {"train": [], "validation": [], "test": []}
    for record in records:
        split[record["split"]].append(record["record_id"])

    class_mapping = {
        item.name: {
            "id": item.class_id,
            "aliases": list(item.aliases),
            "notes": item.notes,
        }
        for item in taxonomy.classes
    }

    return {
        "manifest": {
            "dataset_name": source_manifest.get("dataset_name", "unknown_dataset"),
            "ontology_name": taxonomy.ontology_name,
            "ontology_version": taxonomy.version,
            "record_count": len(records),
            "failure_count": len(failures),
            "sources": source_manifest.get("sources", []),
        },
        "records": records,
        "split": split,
        "class_mapping": class_mapping,
        "failure_gallery": [asdict(item) for item in failures],
    }


def build_step_report(output_dir: Path, status: str, validation: str, evidence: List[str]) -> Path:
    report = output_dir / "step_report.md"
    report.write_text(
        "\n".join(
            [
                "## Step 2 Report",
                f"- Status: {status}",
                "- Objective: Normalize source manifests into the canonical ontology.",
                f"- Artifacts created: {', '.join(evidence)}",
                f"- Validation performed: {validation}",
                f"- Evidence: {', '.join(evidence)}",
                "- Assumptions introduced: see ASSUMPTIONS.md",
                "- Open risks: source manifest completeness and label coverage.",
                "- Next action: build labeling policy and schema.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize ingredient datasets into the ChefKix Phase 1 schema.")
    parser.add_argument("--source-manifest", required=True, help="Path to the source manifest JSON.")
    parser.add_argument("--taxonomy", required=True, help="Path to taxonomy.yaml.")
    parser.add_argument("--output-dir", required=True, help="Output directory for normalized artifacts.")
    args = parser.parse_args()

    source_manifest = load_source_manifest(Path(args.source_manifest))
    taxonomy = load_taxonomy(Path(args.taxonomy))
    result = normalize_manifest(source_manifest, taxonomy)

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    write_json(output_dir / "normalized_manifest.json", result["manifest"])
    write_json(output_dir / "normalized_annotations.json", result["records"])
    write_json(output_dir / "split.json", result["split"])
    write_json(output_dir / "class_mapping.json", result["class_mapping"])
    write_json(output_dir / "failure_gallery.json", result["failure_gallery"])

    build_step_report(
        output_dir,
        status="DONE" if not result["failure_gallery"] else "STUBBED",
        validation="python collect_and_convert.py --source-manifest ... --taxonomy ... --output-dir ...",
        evidence=[
            str(output_dir / "normalized_manifest.json"),
            str(output_dir / "normalized_annotations.json"),
            str(output_dir / "split.json"),
            str(output_dir / "class_mapping.json"),
            str(output_dir / "failure_gallery.json"),
        ],
    )
    print(json.dumps(result["manifest"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
