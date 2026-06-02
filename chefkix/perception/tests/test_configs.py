from pathlib import Path

import yaml


def test_phase1_configs_reference_required_files() -> None:
    yolov8 = yaml.safe_load(Path("configs/yolov8_phase1.yaml").read_text(encoding="utf-8"))
    rtdetr = yaml.safe_load(Path("configs/rtdetr_phase1.yaml").read_text(encoding="utf-8"))
    assert yolov8["ontology_file"] == "labels/taxonomy.yaml"
    assert yolov8["annotation_schema"] == "labels/annotation_schema.yaml"
    assert rtdetr["ontology_file"] == "labels/taxonomy.yaml"
    assert rtdetr["annotation_schema"] == "labels/annotation_schema.yaml"
