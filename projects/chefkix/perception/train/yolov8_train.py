from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict

import yaml

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from chefkix.perception.core import write_json


@dataclass
class TrainingOutcome:
    model_name: str
    status: str
    mode: str
    checkpoint_path: str
    metrics_path: str
    predictions_path: str
    report_path: str


def _write_step_report(
    report_path: Path,
    *,
    status: str,
    objective: str,
    artifacts: list[Path],
    validation: str,
    evidence: Path,
    assumptions: list[str],
    open_risks: list[str],
    next_action: str,
) -> None:
    report_path.write_text(
        "\n".join(
            [
                "## Step 4 Report",
                f"- Status: {status}",
                f"- Objective: {objective}",
                f"- Artifacts created: {', '.join(str(path) for path in artifacts)}",
                f"- Validation performed: {validation}",
                f"- Evidence: {evidence}",
                f"- Assumptions introduced: {'; '.join(assumptions)}",
                f"- Open risks: {'; '.join(open_risks)}",
                f"- Next action: {next_action}",
            ]
        )
        + "\n",
        encoding="utf-8",
    )


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


def smoke_train(config: Dict[str, Any], output_dir: Path) -> TrainingOutcome:
    output_dir.mkdir(parents=True, exist_ok=True)
    checkpoint = output_dir / "best_checkpoint.json"
    metrics = output_dir / "metrics.json"
    predictions = output_dir / "predictions.json"
    report = output_dir / "train_report.json"
    step_report = output_dir / "step_report.md"

    payload = {
        "model_name": "yolov8",
        "status": "STUBBED",
        "reason": "ultralytics trainer and real dataset are not wired yet",
        "config": config,
    }
    write_json(checkpoint, payload)
    write_json(metrics, {"status": "STUBBED", "mAP50": 0.0, "mAP50_95": 0.0})
    write_json(predictions, [{"image_id": "smoke_001", "detections": []}])
    write_json(report, payload)
    _write_step_report(
        step_report,
        status="STUBBED",
        objective="Run the Phase 1 YOLOv8 baseline entrypoint through the smoke contract.",
        artifacts=[checkpoint, metrics, predictions, report, step_report],
        validation="python train/yolov8_train.py --config ... --output-dir ... --mode smoke",
        evidence=report,
        assumptions=["The real Ultralytics trainer is not yet wired.", "Smoke artifacts remain the canonical proof until a dataset-backed run exists."],
        open_risks=["The baseline still does not train on real data.", "Metrics are placeholders rather than learned-model outputs."],
        next_action="Wire a real YOLOv8 trainer against the normalized dataset contract.",
    )

    return TrainingOutcome(
        model_name="yolov8",
        status="STUBBED",
        mode="smoke",
        checkpoint_path=str(checkpoint),
        metrics_path=str(metrics),
        predictions_path=str(predictions),
        report_path=str(report),
    )


def real_train(config: Dict[str, Any], output_dir: Path) -> TrainingOutcome:
    validate_config(config)
    raise RuntimeError("real YOLOv8 training is not wired yet; run --mode smoke until the Ultralytics backend and dataset are available")


def main() -> int:
    parser = argparse.ArgumentParser(description="YOLOv8 Phase 1 training entrypoint.")
    parser.add_argument("--config", required=True, help="Path to the training config.")
    parser.add_argument("--output-dir", required=True, help="Directory where training artifacts should be written.")
    parser.add_argument("--mode", choices=["smoke", "real"], default="smoke", help="Select smoke mode or the real trainer contract.")
    args = parser.parse_args()

    config = load_config(Path(args.config))
    validate_config(config)
    if args.mode == "real":
        outcome = real_train(config=config, output_dir=Path(args.output_dir))
    else:
        outcome = smoke_train(config=config, output_dir=Path(args.output_dir))
    print(json.dumps(outcome.__dict__, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
