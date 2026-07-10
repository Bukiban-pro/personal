## Phase 1 — Standalone Perception Module

### Role

You are operating as an autonomous standalone perception team for ChefKix Phase 1.

Your only job here is to build the ingredient-detection foundation described in `PHASED_IMPLEMENTATION_PLAN.md` and `TECHNICAL_ARCHITECTURE.md`:

- ingredient detection first
- YOLO as baseline
- RT-DETR as challenger
- retrieval and reasoning are out of scope for Phase 1
- full multimodal food brain is out of scope for Phase 1

Treat this module as a product-grade subsystem with its own data, training, evaluation, export, serving, and tests.

### Operating posture

Assume you are allowed to continue without asking for permission unless a hard external blocker appears.

Do not pause for clarification on details that the docs already imply.

If a choice is needed, use the simplest option that preserves reproducibility and future extension.

If a choice must be made between scope and quality, keep the scope tight and the quality strict.

### Execution contract

Work the phase as a sequence of required artifacts.

Do not treat any step as complete until it produces its named artifact and that artifact is readable, runnable, or inspectable.

If a step can be started, start it.

If a step can be validated, validate it.

If a step can be turned into a file, script, config, manifest, test, or report, do that instead of leaving it in prose.

If an assumption is needed, choose the smallest assumption that keeps the pipeline moving and document it in the artifact it affects.

If something is blocked by missing external data or credentials, create the interface, stub, or placeholder needed to continue the rest of the phase.

### Autonomous execution control layer

You are not allowed to describe work as complete unless its artifact exists and its validation result is recorded.

For every step, you must produce four things:

1. the artifact files,
2. one validation command or validation procedure,
3. one machine-readable output where practical,
4. one step report with explicit status.

Every step must end in exactly one of these statuses:

- `DONE` — the artifact is real, readable or runnable, and passed a basic validation.
- `STUBBED` — the artifact cannot be fully completed because of an external blocker, but a clearly labeled placeholder, interface, schema, or mock-compatible component exists so downstream work can continue.
- `BLOCKED` — meaningful progress cannot continue even after creating all reasonable stubs and documenting the blocker.

Never use vague completion language such as “implemented,” “ready,” “handled,” “working,” or “done” without naming the exact artifact path and the exact validation used.

If a step is `STUBBED` or `BLOCKED`, the step report must include:

- blocker description,
- affected files,
- downstream impact,
- fallback action taken,
- condition required to remove the blocker.

### Hard external blocker definition

A hard external blocker is only one of these:

- required dataset is unavailable or access-restricted,
- required credentials or compute access are missing,
- attached architecture documents referenced as source of truth are unavailable,
- an external dependency is broken in a way that prevents basic execution,
- a required license constraint prevents lawful use of a candidate dataset.

A blocker is not hard just because a better implementation would take more effort.

Before marking any step `BLOCKED`, the agent must:

1. create all viable stubs or interfaces,
2. document the blocker,
3. complete any downstream work that can proceed independently,
4. record the exact unblocking condition.

### Evidence contract

No factual claim about project state is valid unless it points to at least one of the following:

- a file path,
- a command that was run,
- a test result,
- a metrics file,
- an exported artifact,
- a screenshot or generated prediction image,
- an API response example.

Every phase summary must include an evidence block listing:

- artifact paths,
- validation commands,
- outputs produced,
- unresolved issues.

### Assumption ledger

Create `chefkix/perception/ASSUMPTIONS.md` and append every non-trivial assumption to it.

Each entry must include:

- assumption,
- reason,
- affected artifact or file,
- risk level (`low`, `medium`, `high`),
- verification plan,
- removal condition.

Assumptions may keep the pipeline moving, but they must never be buried inside scattered scripts or reports.

### Scope change rule

Any newly proposed class, dataset source, endpoint, export target, UI feature, or evaluation metric beyond the existing plan must be placed into exactly one of these buckets:

- `included now`,
- `deferred`,
- `rejected`.

Each entry must include one sentence of justification.

No new scope item may be added silently.

### Plug-in boundary

This module must be easy to plug into a larger system later.

Keep the boundary simple:

- input is an image or frame plus optional metadata
- output is structured detections plus model metadata
- the service must not depend on ChefKix product state
- the service must not need recipe or pantry context to run
- the UI must consume only the service contract

Any integration-specific behavior belongs outside Phase 1.

### Operating doctrine

- Prefer concrete scripts, configs, manifests, and tests over narrative.
- Prefer repeatable pipelines over ad hoc notebooks.
- Prefer a smaller, cleaner class set over a bloated ontology.
- Prefer explicit failure handling over optimistic assumptions.
- Prefer reproducible outputs over cleverness.
- Never couple this phase to ChefKix application logic.

### Source of truth

Use only the attached architecture docs and the working prompt itself as the design basis.
Ground every decision in the Phase 1 framing:

- perception first
- detector first
- shared embeddings later
- grounded reasoning later
- temporal reasoning later

### What Phase 1 is

Phase 1 is a standalone ingredient perception system.

It must detect ingredients in single images and live frames, classify them into a stable ontology, and expose that result through scripts, exported artifacts, and a service.

Phase 1 is not:

- recipe recommendation
- recipe retrieval
- pantry state memory
- nutrition inference
- cooking-step tracking
- action recognition
- user-history personalization

### What the system must accept

The prototype must be able to work from:

- static images
- webcam frames
- public ingredient datasets
- curated negative/background examples

### What the system must produce

The prototype must produce:

- normalized labels
- bounding boxes
- confidence scores
- exportable model artifacts
- evaluation reports
- a runnable inference API
- a minimal visual demo
- tests that prove the pipeline behaves correctly

### Step-by-step work model

Execute the phase as eleven mechanical steps.

For each step:

- create the expected artifact
- write the minimum code or config needed to support the artifact
- validate the artifact with the cheapest useful check
- only then move to the next step

Step outputs:

1. ontology file and synonym map
2. normalized dataset manifest and conversion output
3. labeling policy and annotation schema
4. training configs and run entrypoints
5. baseline weights and training logs
6. challenger weights and comparison metrics
7. evaluation report and failure gallery
8. exported model and parity check results
9. service app and Docker image
10. demo UI and smoke tests
11. handoff docs and runbook

Each step must be written and executed as a step card with these fields:

- Objective:
- Artifact(s):
- Exact validation:
- Expected output format:
- Step completion condition:
- Fallback if blocked:

The step card must be explicit enough that a weak agent can execute it mechanically without inventing missing structure.

### Phase 1 deliverable

Build a standalone ingredient perception prototype that can:

1. ingest and normalize public ingredient datasets
2. define a clean ingredient ontology
3. train a baseline detector
4. benchmark a transformer detector challenger
5. evaluate accuracy, robustness, and latency
6. export to deployable formats
7. serve inference over an API
8. expose a minimal demo UI
9. validate the pipeline with tests

### Folder contract

Create and maintain the work under a standalone perception module.

Expected top-level structure:

- `chefkix/perception/`
- `chefkix/perception/data/`
- `chefkix/perception/labels/`
- `chefkix/perception/train/`
- `chefkix/perception/eval/`
- `chefkix/perception/export/`
- `chefkix/perception/service/`
- `chefkix/perception/ui/`
- `chefkix/perception/tests/`

Every file should belong to one of those functions.

### Class ontology

Start with a compact, high-signal ingredient set.

Recommended initial classes:

- egg
- tomato
- onion
- garlic
- chicken
- beef
- potato
- carrot
- lettuce
- milk carton
- butter
- lemon

Canonical class rules:

- use lowercase snake_case or lowercase words consistently
- choose one canonical label per concept
- treat synonyms as aliases only, not separate classes
- keep container labels separate from ingredient labels unless a class is explicitly container-based
- do not add a class unless it has a clear visual signal and public data support

Rules:

- keep canonical names stable
- define synonyms and aliases per class
- group visually similar items only when the model can actually separate them
- exclude ambiguous long-tail items until the pipeline is stable
- include explicit negative/background guidance

Ontology output requirement:

- write the canonical mapping into `labels/taxonomy.yaml`
- include class ids
- include synonyms
- include notes on ambiguous classes
- include notes on excluded items

### Data priority order

Collect sources in this order:

1. public ingredient detection datasets referenced in the docs
2. public food object datasets that can be remapped cleanly
3. Food-101 style images as supporting positives or negatives where appropriate
4. curated extras only if they improve class balance or hard cases

Do not start with arbitrary scraping.

Do not mix unverified label sets into training without remapping.

### Source handling rules

Every data source must be handled the same way:

1. identify the source
2. record the source metadata
3. map labels to the canonical ontology
4. validate the annotation format
5. split the data intentionally
6. preserve a trace back to the source

If a source cannot be mapped cleanly, do not force it into training.

### Dataset artifact contract

The data phase must leave behind:

- a source manifest
- a class mapping file
- a normalized annotation set
- a split definition
- a small failure gallery

The manifest must be sufficient to recreate the training set without guessing.

### Dataset normalization rules

All datasets must be converted into one normalized schema.

Required normalization steps:

- unify class names to the canonical ontology
- convert annotation format into the training target format
- remove duplicates or near-duplicates where possible
- reject malformed labels
- separate train, validation, and test data explicitly
- keep a source manifest with origin and license notes

Required manifest fields:

- source name
- source URL or reference
- license note
- class coverage
- number of images
- number of boxes
- normalization status

### Data strategy

Build the dataset around public ingredient detection sources already referenced in the docs.

Primary inputs:

- Roboflow FOOD-INGREDIENTS
- YOLO ingredient datasets
- Food-101 as coarse supporting data and negatives where appropriate
- additional curated public images if licenses permit

Required data work:

- download or collect sources in a scripted way
- normalize label names to the ontology
- deduplicate obvious repeats
- record source and license metadata
- separate train/validation/test splits deliberately
- preserve a failure gallery for hard cases

### Labeling rules

Define labeling rules before mass annotation.

The labeling pipeline must specify:

- bounding box policy
- partial-visibility policy
- occlusion policy
- container-vs-content policy
- plural-object policy
- synonym mapping policy
- class exclusion policy

The goal is not just boxes; it is label consistency.

### Annotation artifact contract

The labeling phase must leave behind:

- written labeling rules
- class-specific edge-case notes
- a clear schema for boxes and metadata
- a sample annotated image or dataset slice if possible

The rules must answer:

- what to label
- what not to label
- how to label partially visible items
- how to label containers
- how to resolve ambiguous class membership

Labeling decision policy:

- if the ingredient is visually obvious and bounded, label it
- if the object is only a container and the ingredient cannot be seen, label only if the ontology includes that container class
- if the object is heavily occluded but still identifiable, label it if the visible region supports a stable box
- if the label is ambiguous between two classes, use the canonical class that the ontology and source data most strongly support
- if the item cannot be labeled consistently, exclude it from the initial class set

### Dataset split rules

Use a deliberate split policy, not a random afterthought.

Split rules:

- keep validation and test sets free from obvious near-duplicates of train images
- preserve hard examples in validation and test
- keep source diversity across splits when possible
- ensure every canonical class appears in validation if enough examples exist
- ensure the test set represents the difficult cases, not only easy ones

### Training stack

Baseline:

- Ultralytics YOLOv8n for the first practical pass
- Ultralytics YOLOv8s as the accuracy-oriented baseline upgrade

Challenger:

- RT-DETR family for comparison after the YOLO baseline is working

Training requirements:

- reproducible config files
- fixed random seeds where possible
- explicit dataset paths and splits
- documented hyperparameters
- versioned experiment outputs
- saved checkpoints and best weights

### Fair benchmark invariant

The baseline and challenger must use:

- the same ontology,
- the same dataset version,
- the same train/validation/test split,
- the same normalization outputs,
- the same preprocessing contract unless a difference is explicitly documented,
- the same evaluation script,
- the same reporting format,
- the same latency measurement procedure.

Never compare native training logs from different frameworks as if they are equivalent final benchmark outputs.

Final comparison must come from one shared evaluation pipeline.

### Training workflow

Run training in this order:

1. dataset conversion smoke test
2. small YOLOv8 training smoke run
3. full baseline YOLOv8 training run
4. baseline evaluation and error review
5. RT-DETR challenger run on the same splits
6. comparison report

### Training artifact contract

The training phase must create:

- a reproducible command or script entrypoint
- a saved baseline checkpoint
- a saved challenger checkpoint if run
- a run log
- a metric summary
- sample predictions from held-out images

The baseline is the source of truth until the challenger proves otherwise on the same data.

Training output must include:

- run config
- model checkpoint
- best checkpoint
- metrics summary
- confusion matrix or equivalent error summary
- example predictions on held-out images

### Hyperparameter contract

Do not hide training settings.

Record at minimum:

- model variant
- image size
- batch size
- optimizer or defaults used
- learning rate or defaults used
- augmentation policy
- epoch count
- random seed
- dataset version

### Evaluation stack

Evaluate more than just mAP.

The evaluation suite must include:

- mAP@0.5
- mAP@0.5:0.95
- per-class AP
- confusion matrix
- class-wise failure examples
- precision/recall tradeoffs
- inference latency on representative hardware
- exported model parity checks

Evaluation output must include:

- a machine-readable metrics file
- a human-readable summary
- failure examples with predicted and expected labels
- notes on failure mode patterns

### Evaluation artifact contract

The evaluation phase must create:

- a metrics file
- a summary report
- a confusion matrix or equivalent
- a failure gallery
- a short conclusion on what the detector can and cannot do yet

Interpretation rules:

- visually similar foods are a core error class
- containers and packaged ingredients are a separate ambiguity class
- clutter and occlusion should be measured explicitly
- false confidence is a defect, not a success

### Acceptance thresholds

Do not claim success without measurable thresholds.

Use thresholds appropriate to the small curated class set and initial prototype state:

- the baseline must outperform random or degenerate behavior clearly
- the challenger must be benchmarked on the same split and same preprocessing
- the export path must preserve usable predictions
- the service must return structured results without crashing
- the UI must visibly show boxes and labels on a test image

### Export and runtime

The prototype must leave the notebook and become deployable.

Required export targets:

- ONNX
- a GPU-friendly exported variant
- a CPU-friendly quantized variant where feasible

Required runtime checks:

- exported model loads successfully
- exported model produces comparable outputs to PyTorch
- post-processing remains stable after export
- box coordinates and labels map correctly through the service layer

### Export workflow

Export only after the baseline has been evaluated.

Export workflow:

1. select the best baseline checkpoint
2. export to ONNX or equivalent
3. run a load test on the exported artifact
4. compare outputs against the source model on the same sample images
5. record any drift or mismatch
6. keep the export artifact versioned with the source checkpoint

### Export artifact contract

The export phase must create:

- an exported model file
- a parity check result
- a note on any drift or post-processing mismatch
- a version link back to the training checkpoint

### Service surface

Expose the detector as a standalone inference service.

Minimum endpoints:

- image upload inference
- health check
- model metadata or version endpoint
- optional webcam or streaming path if practical

Minimum service properties:

- deterministic request/response schema
- clear confidence scores
- structured JSON output
- deployable via Docker

Service contract:

- input: image file or frame payload
- output: detections array with class, score, and box coordinates
- health: process and model readiness
- metadata: model version and ontology version

The service must not invent labels or hide low-confidence predictions.

### Service artifact contract

The service phase must create:

- a runnable application entrypoint
- a container build file
- a request/response schema
- a health check path
- a version or metadata endpoint

The service must be runnable without hidden manual steps.

### Demo surface

Create a minimal UI that proves the system works end to end.

The UI should support:

- image upload
- webcam capture or live stream if practical
- rendered detection overlays
- easy visual inspection of labels and confidence

The UI is a verification surface, not a product layer.

### Demo artifact contract

The demo phase must create:

- a simple page or app
- a working image upload flow
- a visible detection overlay
- a visible confidence display
- a failure state when inference does not work

The demo must prove the service contract, not invent a new UI architecture.

Demo behavior:

- upload an image
- render returned boxes
- display class names and confidence scores
- show the model version used
- fail visibly if inference fails

### Tests

Add tests that validate the system, not just the code style.

Minimum test coverage:

- label/ontology mapping tests
- dataset conversion tests
- one or more inference smoke tests
- export/load smoke tests
- endpoint contract tests
- simple demo-path validation where practical

Test policy:

- tests should fail if label mapping breaks
- tests should fail if export output shape changes unexpectedly
- tests should fail if the endpoint response schema changes unexpectedly
- tests should fail if the demo cannot display a sample detection result

### Test artifact contract

The test phase must create:

- at least one ontology test
- at least one dataset conversion test
- at least one inference smoke test
- at least one export/parity smoke test
- at least one endpoint contract test

Tests should be small, direct, and tied to the exact artifact they protect.

### Minimum proof by artifact type

| Artifact | Minimum proof required |
|---|---|
| Ontology | `taxonomy.yaml` exists, parses successfully, class IDs are unique, synonym conflicts tested. |
| Dataset manifest | Source metadata recorded, label mapping recorded, split file exists, schema validation passes. |
| Labeling policy | Written rules exist and at least one annotated example or edge-case table is included. |
| Training config | Entrypoint runs in smoke mode and resolves paths without manual edits. |
| Baseline checkpoint | At least one completed training run exists with logs, metrics, and held-out predictions. |
| Challenger benchmark | Same split benchmark completed and compared through shared evaluation output. |
| Evaluation report | Metrics file, per-class results, confusion artifact, and failure gallery all exist. |
| Export | Exported model loads, runs inference, and parity check result is recorded. |
| Service | Health endpoint passes and one inference request returns schema-valid structured JSON. |
| Demo UI | UI renders detections from the real service response, not mock-only data. |
| Tests | Required smoke and contract tests execute and report pass/fail clearly. |
| Handoff docs | A clean environment can follow the documented run path without hidden manual knowledge. |

This forces usable artifact to mean operationally usable, not merely present as a file.

### Reproducibility gate

Phase 1 is not accepted merely because individual artifacts exist.

Phase 1 is accepted only if a documented command path can reproduce the core pipeline on a clean environment with no hidden manual steps.

Minimum reproducible path:

1. normalize or validate datasets,
2. run a smoke training path,
3. run baseline evaluation,
4. export the selected model,
5. launch the service,
6. run smoke tests,
7. load the demo against the real service contract.

If full training is too expensive in a clean environment, the reproducibility path may substitute smoke training plus checkpoint-based evaluation, but this substitution must be documented explicitly in the handoff docs.

### Required step report template

Use this template at the end of every step:

```md
## Step N Report
- Status: DONE | STUBBED | BLOCKED
- Objective:
- Artifacts created:
- Validation performed:
- Evidence:
- Assumptions introduced:
- Open risks:
- Next action:
```

### Required final phase summary template

```md
# Phase 1 Completion Summary
- Overall status:
- Completed artifacts:
- Stubbed artifacts:
- Blocked artifacts:
- Reproducibility path:
- Benchmark winner and basis:
- Known failure modes:
- Deferred work:
- Handoff files:
```

### Required files

Build the work in the documented standalone location under the perception module.

Likely files include:

- `chefkix/perception/README.md`
- `chefkix/perception/data/collect_and_convert.py`
- `chefkix/perception/data/README.md`
- `chefkix/perception/labels/taxonomy.yaml`
- `chefkix/perception/train/yolov8_train.py`
- `chefkix/perception/train/rtdetr_train.py`
- `chefkix/perception/eval/evaluate.py`
- `chefkix/perception/export/export_to_onnx.py`
- `chefkix/perception/service/app.py`
- `chefkix/perception/service/Dockerfile`
- `chefkix/perception/ui/index.html`
- `chefkix/perception/tests/`

Minimum file intent:

- `README.md` explains how to run the whole module end to end
- `taxonomy.yaml` defines the ontology and aliases
- `collect_and_convert.py` handles dataset acquisition and normalization
- `yolov8_train.py` runs the baseline detector training
- `rtdetr_train.py` runs the challenger benchmark
- `evaluate.py` computes evaluation outputs
- `export_to_onnx.py` exports and validates models
- `app.py` serves inference
- `index.html` demonstrates the detector
- tests cover the pipeline contract

### Acceptance criteria

The phase is only complete when all of the following are true:

1. the ontology is explicit and stable
2. datasets are normalized into the ontology
3. baseline training runs end to end from script
4. challenger training can be benchmarked fairly
5. evaluation reports are reproducible
6. exported models load and infer correctly
7. the service returns useful structured detections
8. the UI demonstrates the full flow
9. tests catch obvious regressions
10. documentation is sufficient for handoff

### Execution order

Always execute Phase 1 in this order:

1. finalize ontology
2. normalize datasets
3. build labeling pipeline
4. create training configs
5. run YOLOv8 baseline
6. benchmark RT-DETR
7. design and run evaluation suite
8. export and validate ONNX
9. ship inference service
10. add demo UI and tests
11. write handoff docs

Do not move to a later step before the earlier step has a working artifact.

### Stop conditions

Stop a step only when its artifact exists and a basic validation passed.

Stop the whole phase only when every artifact listed below exists and is usable:

- ontology
- normalized dataset
- labeling policy
- training configs
- baseline checkpoint
- challenger comparison
- evaluation report
- exported model
- inference service
- demo UI
- tests
- handoff docs

### Explicit non-goals

Do not add these to Phase 1:

- recipe retrieval
- embedding substrate work
- pantry state reasoning beyond simple perception constraints
- nutrition estimation
- cooking state tracking
- action recognition
- ChefKix product integration

### Revised acceptance rule

Phase 1 is complete only when all required artifacts exist, each artifact has passed its minimum proof check, and the module can be exercised end to end through a documented reproducible command path.

A file with the right name does not count as completion. A partial implementation hidden behind prose does not count as completion. A mocked interface must be labeled `STUBBED`, not `DONE`.

### Final instruction

Think like the admin of a standalone perception team.
Build the first real ingredient-detection module cleanly, verify it brutally, and leave the door open for retrieval and reasoning later.
