from pathlib import Path

import yaml

from chefkix.perception.labels.validate_labeling_policy import validate_policy


def test_labeling_policy_has_required_rules() -> None:
    policy = Path("labels/labeling_policy.md").read_text(encoding="utf-8")
    missing = validate_policy(policy)
    assert not missing


def test_annotation_schema_is_well_formed() -> None:
    schema = yaml.safe_load(Path("labels/annotation_schema.yaml").read_text(encoding="utf-8"))
    assert schema["version"] == 1
    assert schema["schema_name"] == "chefkix_phase1_annotation_schema"
    assert "annotations" in schema["fields"]
