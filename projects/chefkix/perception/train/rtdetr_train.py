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

from chefkix.perception.core import write_json


def load_config(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        if path.suffix.lower() in {".yaml", ".yml"}:
            return yaml.safe_load(handle)
        return json.load(handle)


def validate_config(config: Dict[str, Any]) -> None:
    required_keys = ["model", "image_size", "batch_size", "epochs", "random_seed", "dataset_version", "ontology_file", "annotation_schema"]
    missing = [key for key in required_keys if key not in config]
    if missing:
        raise ValueError(f"missing required config keys: {', '.join(missing)}")


def smoke_benchmark(config: Dict[str, Any], output_dir: Path) -> Dict[str, Any]:
    output_dir.mkdir(parents=True, exist_ok=True)
    step_report = output_dir / "step_report.md"
    report_path = output_dir / "benchmark_report.json"
    payload = {
        "model_name": "rtdetr",
        "status": "STUBBED",
        "reason": "RT-DETR trainer is not wired yet",
        "config": config,
        "benchmark": {
            "shared_split": True,
            "shared_ontology": True,
            "shared_evaluator": True,
        },
    }
    write_json(report_path, payload)
    step_report.write_text(
        "\n".join(
            [
                "## Step 5 Report",
                "- Status: STUBBED",
                "- Objective: Run the Phase 1 RT-DETR challenger entrypoint through the smoke contract.",
                f"- Artifacts created: {report_path}, {step_report}",
                "- Validation performed: python train/rtdetr_train.py --config ... --output-dir ... --mode smoke",
                f"- Evidence: {report_path}",
                "- Assumptions introduced: The real RT-DETR backend is not yet wired.",
                "- Open risks: The challenger still does not benchmark learned weights.",
                "- Next action: Wire a real RT-DETR trainer against the same normalized dataset contract.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    return payload


def real_benchmark(config: Dict[str, Any], output_dir: Path) -> Dict[str, Any]:
    validate_config(config)
    raise RuntimeError("real RT-DETR benchmarking is not wired yet; run --mode smoke until the challenger backend and dataset are available")


def main() -> int:
    parser = argparse.ArgumentParser(description="RT-DETR Phase 1 challenger entrypoint.")
    parser.add_argument("--config", required=True, help="Path to the challenger config.")
    parser.add_argument("--output-dir", required=True, help="Directory where benchmark artifacts should be written.")
    parser.add_argument("--mode", choices=["smoke", "real"], default="smoke", help="Select smoke mode or the real challenger contract.")
    args = parser.parse_args()

    config = load_config(Path(args.config))
    validate_config(config)
    if args.mode == "real":
        payload = real_benchmark(config=config, output_dir=Path(args.output_dir))
    else:
        payload = smoke_benchmark(config=config, output_dir=Path(args.output_dir))
    print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
