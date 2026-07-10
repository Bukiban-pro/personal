# Phase 1 Labeling Policy

## Purpose

Define a consistent bounding-box labeling policy for the Phase 1 ingredient ontology.

## Canonical rules

- Label only items that clearly match the ontology.
- Use one box per visible instance.
- Use the smallest stable box that still covers the visible ingredient region.
- Keep boxes tight around the object.
- Do not label uncertain background clutter.
- Do not create new classes during labeling.
- Map aliases to the canonical ontology before annotation review.

## Visibility policy

- Fully visible items should be labeled normally.
- Partially visible items should be labeled only if the visible portion is enough to identify the class reliably.
- Heavily occluded items should be excluded unless the class remains visually unambiguous.
- Container-only items should be labeled only if the ontology includes the container class.

## Ambiguity policy

- If the class is ambiguous, prefer the canonical class that best matches the source manifest and ontology notes.
- If ambiguity cannot be resolved consistently, exclude the item from the initial Phase 1 class set.

## Output contract

- Source manifest: `chefkix/perception/data/normalized_manifest.json`
- Class mapping: `chefkix/perception/data/class_mapping.json`
- Annotation schema: `chefkix/perception/labels/annotation_schema.yaml`
- Edge-case notes: this file and `chefkix/perception/ASSUMPTIONS.md`
