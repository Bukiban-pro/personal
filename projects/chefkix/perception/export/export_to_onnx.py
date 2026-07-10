from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from chefkix.perception.core import write_json


def load_checkpoint(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def export_stub(checkpoint: Dict[str, Any], output_dir: Path) -> Dict[str, Any]:
    output_dir.mkdir(parents=True, exist_ok=True)
    model_path = output_dir / "model.onnx"
    parity_path = output_dir / "parity_report.json"
    manifest_path = output_dir / "export_manifest.json"

    model_path.write_text(
        "STUBBED_ONNX_EXPORT\n"
        + json.dumps({"checkpoint_model": checkpoint.get("model_name"), "status": "STUBBED"}, indent=2)
        + "\n",
        encoding="utf-8",
    )
    parity_payload = {
        "status": "STUBBED",
        "reason": "real ONNX export backend is not wired yet",
        "source_checkpoint": checkpoint,
        "parity": "not_run",
    }
    write_json(parity_path, parity_payload)
    write_json(
        manifest_path,
        {
            "status": "STUBBED",
            "exported_model": str(model_path),
            "parity_report": str(parity_path),
            "source_checkpoint": checkpoint,
        },
    )
    return {"status": "STUBBED", "model_path": str(model_path), "parity_path": str(parity_path)}


def main() -> int:
    parser = argparse.ArgumentParser(description="Export the Phase 1 detector to ONNX or a stubbed equivalent.")
    parser.add_argument("--checkpoint", required=True, help="Path to the checkpoint JSON produced by training.")
    parser.add_argument("--output-dir", required=True, help="Directory where export artifacts should be written.")
    args = parser.parse_args()

    checkpoint = load_checkpoint(Path(args.checkpoint))
    result = export_stub(checkpoint=checkpoint, output_dir=Path(args.output_dir))
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
