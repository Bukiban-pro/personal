import json
from pathlib import Path

from chefkix.perception.data.collect_and_convert import normalize_manifest
from chefkix.perception.core import load_taxonomy


def test_normalize_manifest_writes_expected_structure(tmp_path: Path) -> None:
    taxonomy = load_taxonomy(Path(__file__).resolve().parents[1] / "labels" / "taxonomy.yaml")
    source_manifest = {
        "dataset_name": "smoke_dataset",
        "sources": [
            {
                "name": "smoke_source",
                "url": "https://example.com/smoke",
                "license": "CC0",
                "records": [
                    {
                        "image_id": "record-1",
                        "image_path": "images/record-1.jpg",
                        "annotations": [{"class": "eggs", "bbox": [10, 20, 50, 70]}],
                    },
                    {
                        "image_id": "record-2",
                        "image_path": "images/record-2.jpg",
                        "annotations": [{"class": "tomato", "bbox": [5, 5, 25, 25]}],
                    },
                ],
            }
        ],
    }

    result = normalize_manifest(source_manifest, taxonomy)
    assert result["manifest"]["record_count"] == 2
    assert result["manifest"]["failure_count"] == 0
    assert len(result["records"]) == 2
    assert set(result["split"].keys()) == {"train", "validation", "test"}
    assert result["class_mapping"]["egg"]["id"] == 0

