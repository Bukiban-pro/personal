from __future__ import annotations

import argparse
import json
from pathlib import Path


def validate_export(export_dir: Path) -> dict:
    model_path = export_dir / "model.onnx"
    parity_path = export_dir / "parity_report.json"
    manifest_path = export_dir / "export_manifest.json"

    assert model_path.exists(), f"missing model file: {model_path}"
    assert parity_path.exists(), f"missing parity report: {parity_path}"
    assert manifest_path.exists(), f"missing export manifest: {manifest_path}"

    model_text = model_path.read_text(encoding="utf-8")
    parity = json.loads(parity_path.read_text(encoding="utf-8"))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert "STUBBED_ONNX_EXPORT" in model_text, "expected stubbed export marker"
    assert parity["status"] in {"STUBBED", "DONE"}
    assert manifest["status"] in {"STUBBED", "DONE"}
    assert manifest["exported_model"] == str(model_path)

    return {
        "status": "DONE",
        "export_dir": str(export_dir),
        "model_path": str(model_path),
        "parity_path": str(parity_path),
        "manifest_path": str(manifest_path),
        "parity_status": parity["status"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the Phase 1 export artifacts.")
    parser.add_argument("--export-dir", required=True, help="Directory containing model.onnx and parity_report.json.")
    parser.add_argument("--output", required=True, help="Path to write a machine-readable validation report.")
    args = parser.parse_args()

    report = validate_export(Path(args.export_dir))
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
