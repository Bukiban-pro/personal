# Data normalization

This directory holds the dataset normalization contract for Phase 1.

## Inputs

- A source manifest describing records, labels, and provenance.
- A canonical ontology file at `../labels/taxonomy.yaml`.

## Outputs

- `normalized_manifest.json`
- `normalized_annotations.json`
- `split.json`
- `class_mapping.json`
- `failure_gallery.json`
- `step_report.md`

## Contract

All labels are normalized to the ontology. All splits are deterministic. All invalid annotations are recorded in the failure gallery rather than silently dropped.
