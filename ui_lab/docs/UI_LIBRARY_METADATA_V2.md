# UI Library Metadata (v2)

## Overview

A UI library that only stores components, patterns, and layouts remains a catalog, not a decision system. Structured metadata becomes more valuable when it describes not just classification, but intent, constraints, readiness, and suitability for use in different contexts.

This matters even more when the library may later support autonomous or semi-autonomous decision-making in UI/UX workflows. Recent design-system and AI-oriented writing increasingly treats structured metadata, indexed documentation, and component semantics as the layer that makes systems machine-usable instead of merely human-browsable.

The best way to improve the earlier framework is to move from a flat scorecard to a layered metadata model. The resulting schema should help humans choose better and, separately, help machines make safer and less generic decisions.

## Why the earlier model was not enough

The earlier framework introduced useful fields such as maturity, accessibility confidence, performance cost, opinionation, and expressiveness, but it still behaved mostly like enhanced documentation rather than decision-grade metadata. It described traits, yet did not fully encode the conditions under which a component should or should not be used.

Three gaps matter most:

- It lacked explicit intent, so a component could be richly tagged without exposing its primary job-to-be-done.
- It lacked hard boundaries, so “best for” guidance existed without strong disallowed contexts or approval rules.
- It lacked provenance and evidence granularity, so claims about suitability or trustworthiness remained weaker than they should be.

Because of those gaps, the model was helpful for browsing but not yet optimal for systematic selection. The improvement path is therefore not “more scores,” but better separation between identity, decision constraints, trust signals, and stylistic character.

## Design principles

The improved metadata model should follow five principles.

- Every field must answer a distinct decision question.
- Every numeric score must have written anchors, not just a number.
- Subjective signals such as expressiveness should be clearly separated from objective signals such as lifecycle status or accessibility confidence.
- Strong claims should carry provenance, ownership, and review dates.
- Every component should expose not only where it works, but also where it should be avoided.

These principles align with the broader push toward AI-ready design systems, where the system must provide structured meaning, not just visual assets and examples.

## The v2 schema

The clearest improvement is a seven-layer schema: Identity, Intent, Eligibility, Readiness, Operational Cost, Behavioral Character, and Provenance. This version is more robust because it separates description from permission and separates trust from taste.

| Layer | Purpose | Core fields |
|---|---|---|
| Identity | Find and classify components | Name, family, aliases, platform, variants  |
| Intent | Describe the job the component performs | Primary job, secondary jobs, user goal, UX pattern type  |
| Eligibility | Define where use is allowed or discouraged | Allowed contexts, disallowed contexts, required approvals, autonomy allowance  |
| Readiness | Indicate trust and production confidence | Lifecycle, adoption, evidence type, stability, accessibility confidence  |
| Operational Cost | Capture implementation and runtime burden | Performance budget fit, complexity, dependency burden  |
| Behavioral Character | Describe tone and expressive behavior | Opinionation, expressiveness, formality, interaction intensity, visual dominance  |
| Provenance | Make metadata auditable | Owner, reviewers, last reviewed, examples, changelog, source links  |

## Field definitions

### Identity

Identity fields are not ratings. They support navigation, indexing, and search.

- Name
- Family
- Subfamily
- Aliases
- Platform fit, such as web, mobile, desktop, responsive
- Variant set
- Related components

### Intent

Intent explains why the component exists. This is one of the highest-value additions because many libraries categorize components by shape or type rather than by user task.

- Primary job-to-be-done
- Secondary jobs
- User goal
- Primary interaction model, such as input, navigation, disclosure, compare, select, confirm
- UX pattern type, such as overlay, inline control, structured data view, feedback pattern

### Eligibility

Eligibility is the strongest upgrade over the previous model because it turns vague guidance into decision boundaries.

- Allowed contexts
- Disallowed contexts
- Best for
- Avoid when
- Required approvals
- Autonomy allowance, such as auto-select, suggest-only, human-review-required
- Preconditions, such as screen space, authentication state, data availability, keyboard support

### Readiness

Readiness should remain the main trust layer and should be more objective than the character layer.

- Lifecycle status
- Adoption
- Evidence type
- Stability
- Accessibility confidence
- Internationalization confidence
- Analytics confidence

### Operational Cost

Operational cost prevents a library from over-favoring visually impressive but expensive choices.

- Performance budget fit
- Implementation complexity
- Dependency burden
- Design-token dependency level
- Content authoring burden

### Behavioral Character

Behavioral character captures the component’s experiential profile. These fields are useful, but they should be explicitly treated as interpretive and calibrated by examples.

- Opinionation
- Expressiveness
- Formality
- Interaction intensity
- Visual dominance
- Density feel

### Provenance

Provenance is what makes the metadata maintainable over time. AI-ready systems increasingly depend on structured records, source links, and reviewable artifacts, not only descriptive text.

- Owner
- Last reviewed date
- Reviewer list
- Linked examples
- Source links
- Changelog
- Confidence notes

## New high-value fields

Several additions are especially important because they close gaps that the earlier model left open.

### Primary job clarity

Every component should declare one canonical primary job. This prevents components from becoming ambiguous “do anything” objects and improves retrieval, comparison, and future machine selection.

### Allowed and disallowed contexts

This pair is more useful than generic guidance alone because it defines both fit and boundaries. Systems that want to support machine use need explicit constraints, not only descriptive prose.

### Preconditions

A component may only work well when certain conditions exist, such as enough viewport space, keyboard support, authenticated state, or structured data. Those preconditions should be part of the metadata instead of remaining hidden in implementation notes.

### Evidence type

A single “research” score is too coarse. A stronger system records whether confidence comes from usability tests, analytics, accessibility audits, expert review, or production history.

### Failure cost

Not all wrong choices are equally harmful. A decorative hero card, a destructive confirmation modal, and a consent step have very different misuse costs. That makes failure cost an important addition to serious component governance, even if it is not a purely visual attribute.

### Autonomy allowance

Even if autonomous decision-making is not the main scope of the library today, this field future-proofs the schema. It distinguishes components that can be automatically selected from those that should only be suggested or require human review.

## What to remove or merge

Some earlier fields should be refined rather than retained as-is.

- Replace generic research backing with evidence type, because the source of confidence matters as much as the amount.
- Split complexity into implementation complexity and user proficiency fit if both perspectives matter; a component can be easy to use yet hard to build, or the reverse.
- Treat flexibility carefully, because it often collapses into a vague mixture of neutrality, adaptability, and API breadth. In many systems it is better represented through variants, dependencies, allowed contexts, and opinionation.
- Treat density as density feel unless the library has measurable thresholds that make it a more objective metric.

## Recommended minimum schema

The most practical minimum version of the improved framework is below.

| Field | Type |
|---|---|
| Name | string |
| Family | enum/string |
| Primary job | enum |
| Allowed contexts | tag list |
| Disallowed contexts | tag list |
| Lifecycle | enum |
| Evidence type | tag list |
| Stability | 1–5 |
| Accessibility confidence | 1–5 |
| Failure cost | 1–5 |
| Performance budget fit | 1–5 |
| Opinionation | 1–5 |
| Expressiveness | 1–5 |
| Formality | 1–5 |
| Interaction intensity | 1–5 |
| Autonomy allowance | enum |
| Owner | string |
| Last reviewed | date |

This minimum schema is compact enough to maintain while still being strong enough to support serious library selection and future automation workflows.

## Scoring guidance

The schema becomes trustworthy only when every score has anchors and examples. Without written anchors, different reviewers will interpret the same number differently, which weakens consistency.

### Example anchors for expressiveness

- 1: Plain utility; visually quiet
- 2: Light styling; mostly supports surrounding content
- 3: Noticeable style; adaptable to many product surfaces
- 4: Strong flavor; materially changes screen tone
- 5: Signature visual moment; highly art-directed and attention-seeking

### Example anchors for opinionation

- 1: Neutral shell; disappears into most systems
- 2: Slightly opinionated; easy to adapt
- 3: Recognizable point of view; still flexible
- 4: Strong built-in design language
- 5: Dominant stance; should be used deliberately

### Example anchors for autonomy allowance

- Auto-select: Safe for autonomous default decisions within approved contexts
- Suggest-only: Suitable for recommendations, but not autonomous commitment
- Human-review-required: Should not be chosen without approval
- Restricted: Available only in special flows or privileged environments

## Example component record

```yaml
component: Toast
family: Feedback
primary_job: ephemeral_feedback
allowed_contexts:
  - background_process_completion
  - low_risk_confirmation
  - non_blocking_status_updates
 disallowed_contexts:
  - destructive_confirmation
  - legal_consent
  - critical_health_alerts
lifecycle: supported
evidence_type:
  - usability_tested
  - accessibility_audited
  - production_observed
stability: 4
accessibility_confidence: 4
failure_cost: 3
performance_budget_fit: 5
opinionation: 2
expressiveness: 2
formality: 3
interaction_intensity: 2
autonomy_allowance: suggest_only
owner: design_system_team
last_reviewed: 2026-05-14
```

This format is better than a flat score list because it tells maintainers what the component is, tells designers how it feels, and tells selection systems what boundaries and trust signals apply.

## Final recommendation

The right next step is not to keep adding random descriptive adjectives. The right next step is to make the library decidable: every important component should expose purpose, permissions, trust signals, costs, tone, and provenance in a structured and maintainable way.

That is the point where a component library stops being passive documentation and starts becoming infrastructure for better design decisions.
