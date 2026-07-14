# ocr-ml-pipeline

Deploy when: building text extraction, layout analysis, labeling pipelines, or any CV + ML vertical.

## Pipeline Stages

```
1. DATA AUDIT
   - Source quality: resolution, lighting, skew, occlusion
   - Label consistency: overlap, missing classes, ambiguous boundaries
   - Class balance: long-tail distribution, minimum samples per class

2. PIPELINE DESIGN
   - Preprocessing: normalization, augmentation strategy, resize policy
   - Model selection: baseline (YOLO) vs challenger (RT-DETR/transformer)
   - Export target: ONNX, TensorRT, CoreML

3. TRAINING
   - Reproducible config: fixed seed, documented hyperparams, versioned dataset
   - Split policy: no train/val leakage, preserve hard examples in val
   - Smoke test first: 10 epochs on 100 samples before full run

4. EVALUATION
   - Metrics: mAP@0.5, mAP@0.5:0.95, per-class AP, confusion matrix
   - Failure analysis: class confusion pairs, confidence calibration, edge cases
   - Latency: model-only, pre-to-post, target hardware

5. OVERFITTING CHECKS
   - Train/val gap > 5% mAP? → regularization needed
   - High confidence on OOD samples? → calibration issue
   - Model memorizes augmentations? → evaluate on clean held-out set
```

## Prompts

**Audit:**
```
"Audit this dataset for labeling consistency. Path: <data-dir>.
Check: overlap ratios, class balance, missing annotations, ambiguous boundaries.
Output: data-audit-report.md with findings + fix recommendations."
```

**Pipeline design:**
```
"Design an OCR pipeline for <use-case>. Constraints: <latency>, <hardware>, <accuracy>.
Output: pipeline-design.md with model choice, preprocessing steps, augmentation policy,
export target, and evaluation protocol."
```

## Artifacts
- `data-audit-report.md`
- `pipeline-design.md`
- `training-run-<id>/` (config, weights, logs, metrics)
- `evaluation-report.md` (per-class metrics, confusion matrix, failure gallery)
