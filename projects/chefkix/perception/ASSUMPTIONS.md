# Assumptions

- Assumption: the initial Phase 1 scaffold will start with smoke/stubbed training and export entrypoints before real dataset access exists.
  - Reason: the repository currently has no perception module, no dataset assets, and no model artifacts.
  - Affected artifact or file: `chefkix/perception/train/*.py`, `chefkix/perception/export/export_to_onnx.py`, `chefkix/perception/service/app.py`.
  - Risk level: medium
  - Verification plan: replace stubs with real model hooks once dataset and training dependencies are available.
  - Removal condition: a real dataset and trainer backend are wired into the pipeline.

- Assumption: the demo service can use a deterministic smoke detector until a trained detector is available.
  - Reason: there is no trained model yet, but the service and demo contract must exist now.
  - Affected artifact or file: `chefkix/perception/service/app.py`, `chefkix/perception/ui/index.html`.
  - Risk level: medium
  - Verification plan: contract tests assert schema and response shape; later replace detector implementation.
  - Removal condition: a trained detector is exported and loaded by the service.
