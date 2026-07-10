# ChefKix Perception Phase 1

Standalone ingredient perception module for Phase 1.

## Scope

- Ingredient detection only.
- YOLO is the baseline plan.
- RT-DETR is the challenger plan.
- Retrieval, reasoning, pantry memory, nutrition, cooking-state tracking, action recognition, and product integration are out of scope.

## What exists in this scaffold

- Canonical ingredient ontology in `labels/taxonomy.yaml`.
- Dataset normalization script in `data/collect_and_convert.py`.
- Evaluation script in `eval/evaluate.py`.
- Training/export stubs that emit explicit reports.
- FastAPI service contract in `service/app.py`.
- Demo page in `ui/index.html`.
- Tests for ontology, normalization, evaluation, export, and service contracts.

## Current status

The module is scaffolded and contract-driven. Dataset normalization, labeling validation, evaluation, service, and demo smoke paths are present. Training entrypoints now expose explicit `smoke` and `real` modes; the `real` mode remains blocked until a dataset and trainer backend are wired in.

## Reproducibility path

Use the single-command smoke orchestrator to reproduce the current pipeline end to end:

```powershell
python scripts/phase1_smoke.py --output-dir runs\phase1_smoke
```

This command runs normalization, labeling validation, baseline and challenger smoke steps, export, evaluation, and the service contract check. Its summary artifact is `runs/phase1_smoke/phase1_smoke_summary.json`.

## Runbook

Install dependencies:

```powershell
cd c:\Users\YOGA\Desktop\personal\chefkix\perception
pip install -r requirements.txt
```

Validate the ontology and smoke data pipeline:

```powershell
python -m pytest tests/test_taxonomy.py tests/test_collect_and_convert.py tests/test_evaluate.py tests/test_service.py tests/test_export.py
```

Validate the labeling policy and demo UI contract:

```powershell
python -m pytest tests/test_labeling_policy.py tests/test_configs.py tests/test_demo_ui.py
```

Validate the service contract:

```powershell
python scripts\validate_service.py --output runs\service_validation.json
```

Compare the YOLO baseline and RT-DETR challenger through the shared evaluator:

```powershell
python eval\compare_benchmarks.py --baseline-eval runs\phase1_smoke\evaluation\metrics.json --challenger-eval runs\phase1_smoke\evaluation\metrics.json --baseline-train runs\phase1_smoke\yolov8\train_report.json --challenger-train runs\phase1_smoke\rtdetr\benchmark_report.json --output-dir runs\phase1_smoke\comparison
```

Validate the demo UI contract:

```powershell
python scripts\validate_demo.py --html ui\index.html --output runs\demo_validation.json
```

Run the smoke normalizer:

```powershell
python data/collect_and_convert.py --source-manifest path\to\source_manifest.json --taxonomy labels/taxonomy.yaml --output-dir runs\normalize
```

Run the stubbed training entrypoint:

```powershell
python train/yolov8_train.py --config path\to\config.yaml --output-dir runs\yolov8 --mode smoke
```

The baseline script also writes `step_report.md` in the output directory.

Run the challenger smoke entrypoint:

```powershell
python train/rtdetr_train.py --config path\to\config.yaml --output-dir runs\rtdetr --mode smoke
```

Run the export stub:

```powershell
python export/export_to_onnx.py --checkpoint runs\yolov8\train_report.json --output-dir runs\export
```

Validate the exported artifact stub:

```powershell
python scripts\validate_export.py --export-dir runs\export --output runs\export_validation.json
```

Start the service:

```powershell
uvicorn service.app:app --reload
```

Run the full reproducibility smoke path:

```powershell
python scripts/phase1_smoke.py --output-dir runs\phase1_smoke
```

## Evidence and assumptions

See `ASSUMPTIONS.md` for non-trivial assumptions. Step reports and evidence files are written by the scripts in their respective output directories.

## Step reports

The training scripts now write explicit step reports alongside their JSON artifacts:

- `runs\...\yolov8\step_report.md`
- `runs\...\rtdetr\step_report.md`
