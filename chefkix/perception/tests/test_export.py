import json
from pathlib import Path

from chefkix.perception.export.export_to_onnx import export_stub


def test_export_stub_creates_artifacts(tmp_path: Path) -> None:
    checkpoint = {"model_name": "yolov8", "status": "STUBBED"}
    result = export_stub(checkpoint=checkpoint, output_dir=tmp_path)
    assert Path(result["model_path"]).exists()
    assert Path(result["parity_path"]).exists()
    manifest = json.loads((tmp_path / "export_manifest.json").read_text(encoding="utf-8"))
    assert manifest["status"] == "STUBBED"

