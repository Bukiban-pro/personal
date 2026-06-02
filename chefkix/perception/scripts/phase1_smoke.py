from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict


PERCEPTION_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = PERCEPTION_ROOT.parent
WORKSPACE_ROOT = REPO_ROOT.parent
PYTHON = sys.executable

if str(WORKSPACE_ROOT) not in sys.path:
    sys.path.append(str(WORKSPACE_ROOT))


def run(command: list[str], cwd: Path) -> str:
    result = subprocess.run(command, cwd=cwd, capture_output=True, text=True, check=True)
    return result.stdout.strip()


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the Phase 1 reproducibility smoke path.")
    parser.add_argument("--output-dir", required=True, help="Directory for the smoke run artifacts.")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    source_manifest = PERCEPTION_ROOT / "tests" / "fixtures" / "smoke_source_manifest.json"
    taxonomy = PERCEPTION_ROOT / "labels" / "taxonomy.yaml"
    policy = PERCEPTION_ROOT / "labels" / "labeling_policy.md"
    schema = PERCEPTION_ROOT / "labels" / "annotation_schema.yaml"
    yolov8_config = PERCEPTION_ROOT / "configs" / "yolov8_phase1.yaml"
    rtdetr_config = PERCEPTION_ROOT / "configs" / "rtdetr_phase1.yaml"

    normalize_dir = output_dir / "normalize"
    label_dir = output_dir / "labeling"
    yolov8_dir = output_dir / "yolov8"
    rtdetr_dir = output_dir / "rtdetr"
    export_dir = output_dir / "export"
    eval_dir = output_dir / "evaluation"

    normalize_cmd = [PYTHON, "data/collect_and_convert.py", "--source-manifest", str(source_manifest), "--taxonomy", str(taxonomy), "--output-dir", str(normalize_dir)]
    label_cmd = [PYTHON, "labels/build_labeling_pipeline.py", "--policy", str(policy), "--schema", str(schema), "--taxonomy", str(taxonomy), "--normalized-annotations", str(normalize_dir / "normalized_annotations.json"), "--output-dir", str(label_dir)]
    yolov8_cmd = [PYTHON, "train/yolov8_train.py", "--config", str(yolov8_config), "--output-dir", str(yolov8_dir), "--mode", "smoke"]
    rtdetr_cmd = [PYTHON, "train/rtdetr_train.py", "--config", str(rtdetr_config), "--output-dir", str(rtdetr_dir), "--mode", "smoke"]
    export_cmd = [PYTHON, "export/export_to_onnx.py", "--checkpoint", str(yolov8_dir / "train_report.json"), "--output-dir", str(export_dir)]
    eval_cmd = [PYTHON, "eval/evaluate.py", "--ground-truth", str(normalize_dir / "normalized_annotations.json"), "--predictions", str(yolov8_dir / "predictions.json"), "--taxonomy", str(taxonomy), "--output-dir", str(eval_dir)]

    outputs: Dict[str, Any] = {}
    outputs["normalize"] = run(normalize_cmd, cwd=PERCEPTION_ROOT)
    outputs["labeling"] = run(label_cmd, cwd=PERCEPTION_ROOT)
    outputs["yolov8"] = run(yolov8_cmd, cwd=PERCEPTION_ROOT)
    outputs["rtdetr"] = run(rtdetr_cmd, cwd=PERCEPTION_ROOT)
    outputs["export"] = run(export_cmd, cwd=PERCEPTION_ROOT)
    outputs["evaluation"] = run(eval_cmd, cwd=PERCEPTION_ROOT)

    from chefkix.perception.service.app import app
    from fastapi.testclient import TestClient

    client = TestClient(app)
    health = client.get("/health").json()
    infer = client.post(
        "/infer",
        files={"file": ("egg_sample.jpg", b"sample-bytes", "image/jpeg")},
        data={"label_hint": "egg"},
    ).json()

    summary = {
        "status": "DONE",
        "outputs": outputs,
        "health": health,
        "infer": infer,
        "artifacts": {
            "normalize": str(normalize_dir),
            "labeling": str(label_dir),
            "yolov8": str(yolov8_dir),
            "rtdetr": str(rtdetr_dir),
            "export": str(export_dir),
            "evaluation": str(eval_dir),
            "yolov8_step_report": str(yolov8_dir / "step_report.md"),
            "rtdetr_step_report": str(rtdetr_dir / "step_report.md"),
        },
        "reproducibility_path": [
            "data/collect_and_convert.py",
            "labels/build_labeling_pipeline.py",
            "train/yolov8_train.py",
            "train/rtdetr_train.py",
            "export/export_to_onnx.py",
            "eval/evaluate.py",
        ],
    }

    (output_dir / "phase1_smoke_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    (output_dir / "step_report.md").write_text(
        "\n".join(
            [
                "## Step 11 Report",
                "- Status: DONE",
                "- Objective: Exercise the reproducibility path through the Phase 1 scaffold.",
                f"- Artifacts created: {output_dir / 'phase1_smoke_summary.json'}, {output_dir / 'step_report.md'}",
                f"- Validation performed: {PYTHON} scripts/phase1_smoke.py --output-dir ...",
                f"- Evidence: {output_dir / 'phase1_smoke_summary.json'}",
                "- Assumptions introduced: smoke detector and stubbed trainer/export backends remain placeholders.",
                "- Open risks: real dataset access and actual model training are still pending.",
                "- Next action: swap stubbed training/export internals for real model backends.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
