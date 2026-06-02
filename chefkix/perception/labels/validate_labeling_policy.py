from __future__ import annotations

import argparse
from pathlib import Path

import yaml


REQUIRED_RULES = [
    "label only items that clearly match the ontology",
    "use one box per visible instance",
    "use the smallest stable box",
    "do not create new classes during labeling",
]


def validate_policy(text: str) -> list[str]:
    lower = text.lower()
    missing = [rule for rule in REQUIRED_RULES if rule not in lower]
    return missing


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the Phase 1 labeling policy file.")
    parser.add_argument("--policy", required=True, help="Path to labeling_policy.md")
    parser.add_argument("--schema", required=True, help="Path to annotation_schema.yaml")
    args = parser.parse_args()

    policy_text = Path(args.policy).read_text(encoding="utf-8")
    schema = yaml.safe_load(Path(args.schema).read_text(encoding="utf-8"))
    missing = validate_policy(policy_text)
    assert not missing, f"missing required rules: {missing}"
    assert schema["version"] == 1
    assert schema["schema_name"] == "chefkix_phase1_annotation_schema"
    print("labeling policy validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
