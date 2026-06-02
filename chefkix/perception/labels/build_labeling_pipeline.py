from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict

import yaml

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from chefkix.perception.core import load_taxonomy, write_json
from chefkix.perception.labels.validate_labeling_policy import validate_policy


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def build_report(policy_path: Path, schema_path: Path, taxonomy_path: Path, normalized_annotations_path: Path) -> Dict[str, Any]:
    policy_text = policy_path.read_text(encoding="utf-8")
    schema = yaml.safe_load(schema_path.read_text(encoding="utf-8"))
    taxonomy = load_taxonomy(taxonomy_path)
    annotations = load_json(normalized_annotations_path)

    missing_policy_rules = validate_policy(policy_text)
    schema_ok = schema["version"] == 1 and schema["schema_name"] == "chefkix_phase1_annotation_schema"
    annotation_classes = sorted({annotation["class"] for record in annotations for annotation in record.get("annotations", [])})
    ontology_classes = sorted(item.name for item in taxonomy.classes)
    unknown_classes = [name for name in annotation_classes if name not in ontology_classes]

    return {
        "status": "DONE" if not missing_policy_rules and schema_ok and not unknown_classes else "STUBBED",
        "policy_path": str(policy_path),
        "schema_path": str(schema_path),
        "taxonomy_path": str(taxonomy_path),
        "normalized_annotations_path": str(normalized_annotations_path),
        "missing_policy_rules": missing_policy_rules,
        "schema_ok": schema_ok,
        "unknown_classes": unknown_classes,
        "annotation_count": len(annotations),
        "ontology_class_count": len(ontology_classes),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the Phase 1 labeling pipeline contract.")
    parser.add_argument("--policy", required=True, help="Path to labeling_policy.md")
    parser.add_argument("--schema", required=True, help="Path to annotation_schema.yaml")
    parser.add_argument("--taxonomy", required=True, help="Path to taxonomy.yaml")
    parser.add_argument("--normalized-annotations", required=True, help="Path to normalized_annotations.json")
    parser.add_argument("--output-dir", required=True, help="Directory for the labeling pipeline report.")
    args = parser.parse_args()

    report = build_report(
        policy_path=Path(args.policy),
        schema_path=Path(args.schema),
        taxonomy_path=Path(args.taxonomy),
        normalized_annotations_path=Path(args.normalized_annotations),
    )

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    write_json(output_dir / "labeling_pipeline_report.json", report)
    (output_dir / "step_report.md").write_text(
        "\n".join(
            [
                "## Step 3 Report",
                f"- Status: {report['status']}",
                "- Objective: Validate the labeling policy, schema, and normalized dataset against the ontology.",
                f"- Artifacts created: {output_dir / 'labeling_pipeline_report.json'}, {output_dir / 'step_report.md'}",
                f"- Validation performed: python build_labeling_pipeline.py --policy ... --schema ... --taxonomy ... --normalized-annotations ... --output-dir ...",
                f"- Evidence: {output_dir / 'labeling_pipeline_report.json'}",
                "- Assumptions introduced: see ASSUMPTIONS.md",
                "- Open risks: real annotation coverage still depends on external dataset access.",
                "- Next action: use the same ontology and configs to train the baseline detector.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
