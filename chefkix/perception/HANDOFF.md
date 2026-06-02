# Phase 1 Handoff

## Overall status

Phase 1 is scaffolded and smoke-validated. The module is ready for real dataset and trainer wiring, and the baseline/challenger entrypoints now expose explicit `smoke` and `real` modes.

## Completed artifacts

- Canonical ontology: `labels/taxonomy.yaml`
- Assumptions ledger: `ASSUMPTIONS.md`
- Labeling policy: `labels/labeling_policy.md`
- Annotation schema: `labels/annotation_schema.yaml`
- Labeling pipeline validator: `labels/build_labeling_pipeline.py`
- Dataset normalizer: `data/collect_and_convert.py`
- Baseline training stub with explicit smoke/real mode: `train/yolov8_train.py`
- Challenger training stub with explicit smoke/real mode: `train/rtdetr_train.py`
- Shared evaluator: `eval/evaluate.py`
- Export stub: `export/export_to_onnx.py`
- Service contract: `service/app.py`
- Demo UI: `ui/index.html`
- Smoke orchestrator: `scripts/phase1_smoke.py`
- Export validator: `scripts/validate_export.py`
- Service validator: `scripts/validate_service.py`
- Demo validator: `scripts/validate_demo.py`
- Benchmark comparator: `eval/compare_benchmarks.py`
- Baseline step report: `runs/.../yolov8/step_report.md`
- Challenger step report: `runs/.../rtdetr/step_report.md`
- Contract tests: `tests/`

## Stubbed artifacts

- Real YOLO training backend
- Real RT-DETR training backend
- Real ONNX export backend
- Real external dataset acquisition

## Blocked artifacts

- None in the current scaffold

## Reproducibility path

```powershell
cd c:\Users\YOGA\Desktop\personal\chefkix\perception
python scripts\phase1_smoke.py --output-dir runs\phase1_smoke
```

## Export validation path

```powershell
python export\export_to_onnx.py --checkpoint runs\phase1_smoke\yolov8\train_report.json --output-dir runs\phase1_smoke\export
python scripts\validate_export.py --export-dir runs\phase1_smoke\export --output runs\phase1_smoke\export_validation.json
```

## Service validation path

```powershell
python scripts\validate_service.py --output runs\phase1_smoke\service_validation.json
```

## Demo validation path

```powershell
python scripts\validate_demo.py --html ui\index.html --output runs\phase1_smoke\demo_validation.json
```

## Benchmark comparison path

```powershell
python eval\compare_benchmarks.py --baseline-eval runs\phase1_smoke\evaluation\metrics.json --challenger-eval runs\phase1_smoke\evaluation\metrics.json --baseline-train runs\phase1_smoke\yolov8\train_report.json --challenger-train runs\phase1_smoke\rtdetr\benchmark_report.json --output-dir runs\phase1_smoke\comparison
```

## Benchmark winner and basis

`baseline` on `shared-evaluator-f1` in the smoke comparison artifact, but both tracks remain stubbed until a real trainer is wired in.

## Known failure modes

- The current smoke detector is deterministic and hint-based, not learned.
- Training and export artifacts are placeholders.
- Real dataset coverage remains dependent on external access.
- The training scripts now fail loudly in `--mode real` until the external trainer backend and dataset are available.

## Deferred work

- Wire actual YOLOv8 trainer.
- Wire actual RT-DETR challenger.
- Replace export stub with real ONNX export.
- Swap smoke detections for model-driven predictions.
- Wire real `--mode real` execution for YOLOv8 and RT-DETR once data and trainer dependencies are available.

## Handoff files

- `README.md`
- `ASSUMPTIONS.md`
- `labels/taxonomy.yaml`
- `labels/labeling_policy.md`
- `labels/annotation_schema.yaml`
- `scripts/phase1_smoke.py`
