# testing-spreadsheets

Build, audit, repair, normalize, regenerate, package, and finalize software testing spreadsheets in Excel, Google Sheets, or CSV-backed workbooks. Use for test case sheets, QA matrices, execution logs, RTMs, defect trackers, workbook gap analysis, explicitness upgrades, formula drift, header normalization, cross-sheet synchronization, and submission-ready proof paths.

Argument hint: Describe the workbook, any exemplar or grading target, the source of truth, and whether you want audit, repair, regeneration, cleanup, or finalization.

Use this skill when the task is centered on sheets, software testing, Excel, test workbooks, QA matrices, traceability tables, or any spreadsheet that acts as a testing system rather than a casual document, especially under grading, audit, or submission pressure.

This skill treats a workbook as a structured testing artifact with contracts, dependencies, and integrity rules. The goal is not only to make the sheet look correct, but to keep IDs, formulas, coverage, execution logic, and deliverable state truthful.

## Use When

- The user wants to create, repair, audit, or extend a software testing workbook.
- The task involves Excel, Google Sheets, CSV exports, or multi-sheet QA documents.
- The workbook contains test cases, execution logs, requirements traceability, defect links, dashboards, coverage matrices, or sign-off summaries.
- The user needs gaps identified, rows added, headers normalized, formulas repaired, or sheets synchronized.
- The user wants workbook changes to be systematic rather than manual cell-by-cell patching.
- The workspace has multiple workbook versions, translated exports, backups, or generated artifacts and you need one clear active delivery path.

## Core Mindset

- Treat every workbook as a data model first and a visual document second.
- Assume the workbook has an implicit contract: sheet names, sheet order, header names, column semantics, formulas, validations, and reference IDs may matter.
- Never confuse visual completeness with testing completeness.
- Audit adversarially. A polished workbook may still be structurally wrong or grader-hostile.
- Never default missing evidence to success. Empty cells, vague statuses, and unlinked requirements are audit targets.
- Preserve traceability. Test IDs, requirement IDs, defect IDs, build numbers, and execution evidence are the spine of the workbook.
- Work from a source of truth whenever one exists: SRS, API spec, feature list, test plan, user stories, business rules, defect list, or an authoritative master sheet.
- Optimize for explicitness and reviewer comprehension before cosmetic beauty.

## Common Workbook Types

- Master test case lists
- Detailed execution sheets
- Requirements traceability matrices (RTM)
- Defect or bug trackers
- Test summary dashboards
- Coverage gap matrices
- UAT sign-off sheets
- Regression packs
- API validation matrices
- Scenario libraries for BDD or end-to-end testing

## Operating Rules

1. Audit before editing.
2. Identify the workbook contract before adding rows.
3. Distinguish source columns from derived columns.
4. Preserve stable identifiers unless the user explicitly wants a renumbering scheme.
5. Normalize vocabulary before calculating totals or coverage.
6. Fill formulas, validations, and dependent fields consistently after structural edits.
7. Report assumptions explicitly when the source of truth is incomplete.
8. If the workbook is generated, fix the generator and rebuild before doing one-off workbook surgery.

## Required Inputs

Gather these as early as possible:

- Workbook or exported sheets
- Artifact type: test cases, RTM, execution log, defect log, dashboard, or mixed workbook
- Source of truth: specification, requirements, code, API contract, business rules, or existing master sheet
- Scope: which modules, features, services, or user journeys are in play
- Edit goal: audit, repair, expand, normalize, translate, synchronize, summarize, or rebuild
- Constraints: preserve formulas, preserve styling, preserve sheet order, preserve row IDs, or maintain compatibility with an existing submission format

If any of these are unclear, ask only the minimum clarifying questions required to avoid corrupting the workbook structure.

## Artifact Map

Before editing, classify the workspace around the workbook:

- active workbook or canonical source
- generator scripts or templates
- translated or exported inspection surfaces
- packaged deliverable folder
- backups and stale copies

If the workspace has multiple versions, state which one is authoritative and which ones are generated or stale before making edits.

## Assignment Alignment And Invariants

Before large repairs, align the workbook against the actual task wording, not just the current row counts.

Track three things separately:

- assignment or grading requirements
- implemented system truth
- current workbook state

If those three disagree, do not silently force them to match.

- If the workbook is wrong, fix the workbook.
- If the task wording is simplified or stale but the product truth is different, keep the workbook truthful to the real system and document the divergence clearly in the handoff notes.
- If counts, critical subsets, UTCID totals, or required-sheet totals are already correct, freeze them as quantitative invariants and preserve them while repairing wording, headers, or traceability.

## Procedure

### 1. Classify the Task

Determine which mode applies:

- Audit: find defects, drift, false totals, broken references, or missing coverage
- Repair: fix formulas, headers, statuses, IDs, or damaged sheet structure
- Expansion: add missing test cases, scenarios, or execution rows
- Synchronization: align multiple sheets with a master list or source spec
- Normalization: standardize naming, statuses, priorities, severity scales, or module labels
- Regeneration: rebuild workbook outputs from a script, export, or canonical source
- Translation: convert workbook content while preserving structure and formulas

Do not mix modes casually. An audit should first explain what is wrong. A repair should state what is being changed. An expansion should identify the coverage logic used.

### 2. Inventory the Workbook Contract

Inspect and record:

- Sheet names and sheet order
- Hidden sheets, protected sheets, filters, frozen panes, tables, named ranges, and merged cells if relevant
- Header row location and exact column names
- Mandatory columns versus informational columns
- Formula columns and aggregation logic
- Data validation lists and controlled vocabularies
- Cross-sheet references such as VLOOKUP, XLOOKUP, INDEX/MATCH, totals, or dashboard rollups
- ID schemes such as `TC-001`, `REQ-AUTH-004`, `BUG-019`, or execution run IDs

Before editing, be able to state one falsifiable hypothesis about the workbook's controlling structure. Example: the master sheet is the canonical source and all detailed sheets derive module-specific subsets from it. Then identify one cheap check that could disprove that hypothesis.

### 3. Identify the Data Model

Map the workbook into entities, not cells. Typical entities include:

- Requirement
- Feature or module
- Test case
- Test step
- Expected result
- Precondition
- Test data
- Execution record
- Defect
- Owner or assignee
- Release, build, or environment

Typical key fields include:

- Test Case ID
- Requirement ID
- Module
- Scenario
- Preconditions
- Steps
- Expected Result
- Priority
- Severity
- Test Type
- Automation Status
- Execution Status
- Defect ID
- Remarks
- Executed By
- Execution Date
- Build or Version

Once the model is clear, workbook operations become safer: duplicates, gaps, or drift can be detected against entities and keys rather than eyeballing rows.

### 4. Audit for Truthfulness

Check for structural and testing-quality defects.

Structural defects:

- Duplicate IDs
- Missing IDs
- Broken formulas or formula drift between rows
- Totals that do not match row-level statuses
- Inconsistent headers across parallel sheets
- Orphan references to missing requirements, defects, or modules
- Empty mandatory columns hidden behind visually complete rows
- Mixed vocabularies such as `Pass`, `PASS`, `Passed`, and `OK`
- Hardcoded values where formulas should exist
- Misaligned copied rows that shifted columns silently

Testing-quality defects:

- Missing negative cases
- Missing boundary cases
- Missing validation of error handling
- Missing role-based or permission scenarios
- Missing state-transition scenarios
- Missing cross-module flows
- Missing non-functional markers where performance, security, or reliability matter
- Fake breadth: many rows that repeat the same assertion with cosmetic wording changes
- Execution sheets that allow pass/fail without evidence, defect linkage, or notes

### 5. Choose the Edit Strategy

Use the smallest correct intervention.

- For header drift, normalize headers before adding content.
- For broken formulas, repair the formula pattern before filling down new rows.
- For coverage gaps, add rows only after defining the missing scenario categories.
- For master-detail workbook designs, update the master source first unless the workbook contract clearly says otherwise.
- For dashboards, repair source data integrity before touching summary formulas.

Avoid ad hoc editing where one sheet is patched while dependent sheets remain stale.

### 6. Execute Edits Safely

When editing:

- Preserve sheet order unless the user asked for restructuring.
- Preserve existing IDs when possible; when generating IDs, use the workbook's observed numbering convention.
- Keep controlled vocabularies consistent.
- Propagate formulas and validations to all inserted rows.
- Preserve traceability fields even when data is incomplete; prefer explicit placeholders or status markers over silent blanks when the workbook already uses such markers.
- Keep comments or remarks factual; do not invent evidence of execution.
- If a row is derived from another artifact, keep its linkage visible.

If the workbook is formula-heavy or formatting-sensitive, prefer Excel-aware tooling or script-based workbook edits over lossy CSV-only edits.

### 7. Validate After Editing

Perform a focused validation pass immediately after the first substantive edit.

Minimum validation checks:

- Sheet still opens or parses cleanly
- Expected sheets still exist in the right order
- Headers remain intact
- Inserted or changed rows follow the same schema
- Formula columns still evaluate with the correct relative references
- Totals and dashboards reconcile with detailed rows
- No new duplicate or orphan IDs were introduced
- Status values remain within the allowed vocabulary

If the workbook has scripts or automated audit commands, run them before making broader follow-up edits.

### 8. Report Like an Auditor

A good result includes:

- What was changed
- Why it was changed
- What assumptions were necessary
- What was validated
- What remains unresolved due to missing source information

Prefer counts and evidence over vague claims. Example: `Added 24 missing boundary and negative cases for password reset, session expiry, and role mismatch flows` is useful. `Improved test cases` is not.

## Specialized Playbooks

### Master Test Case List

Priorities:

- Unique and stable test case IDs
- One row per meaningful scenario
- Clear coverage by module, feature, and requirement
- Balanced mix of positive, negative, boundary, authorization, and recovery scenarios
- Avoid duplicate cases that differ only in phrasing

Audit questions:

- Does each requirement map to at least one test?
- Are critical flows covered by multiple scenario types, not just happy path?
- Are priorities justified, or are all tests marked high?
- Are expected results precise enough to execute?

### Detailed Execution Sheet

Priorities:

- Execution status vocabulary is controlled
- Each executed row can be tied back to a stable test case
- Defect ID and notes are captured for failures and blocks
- Environment, build, tester, and execution date are recorded when the workbook expects them

Audit questions:

- Can someone audit a `Fail` or `Blocked` result without external guesswork?
- Do execution totals match the row-level statuses?
- Are there rows marked `Pass` with missing evidence columns?

### Requirements Traceability Matrix

Priorities:

- Every requirement is represented once in canonical form
- Requirement-to-test mapping is explicit
- Missing coverage is visible rather than implied away
- Optional downstream links to defects or automation assets remain consistent

Audit questions:

- Which requirements have zero tests?
- Which tests claim requirements that do not exist?
- Are many-to-many mappings preserved without duplicate noise?

### Defect Tracker

Priorities:

- Stable defect IDs
- Controlled severities and statuses
- Clear reproduction steps and linkage to tests or modules
- Separation of defect state from test execution state

Audit questions:

- Are closed defects still linked from failing execution rows?
- Are severity and priority being used consistently?
- Are duplicate defects masking the same root cause?

### Summary Dashboard

Priorities:

- Derived only from truthful source data
- No hardcoded totals unless explicitly intended
- Metrics definitions are stable and documented

Audit questions:

- Do dashboard counts reconcile with source sheets?
- Are percentages protected from divide-by-zero or hidden-row distortion?
- Is `Not Run` being silently folded into `Pass` or omitted from totals?

## Heuristics for Finding Missing Tests

When expanding a workbook, scan the existing suite against these dimensions:

- Happy path
- Negative path
- Boundary value
- Null or empty input
- Invalid format
- Duplicate data
- Permission or role mismatch
- State transition and lifecycle edge cases
- Timeout, retry, or concurrency behavior
- Integration failure between modules or services
- Reporting and dashboard correctness
- Localization, date/time, and numeric formatting if applicable

If the workbook is shallow, improve depth. Do not inflate row count with cosmetic variants.

## Controlled Vocabulary Guidance

Normalize vocabulary before calculating anything. Typical examples:

- Execution Status: `Not Run`, `Pass`, `Fail`, `Blocked`
- Priority: `Low`, `Medium`, `High`, `Critical`
- Severity: `Minor`, `Major`, `Critical`
- Automation: `Manual`, `Automated`, `Planned`, `N/A`

Only change vocabularies if the workbook or the user clearly wants normalization. Otherwise preserve the local convention and make it consistent.

## Content Vs Layout Triage

Before spending time on formatting, classify the complaint:

- Content truth problem: missing cases, vague wording, broken traceability, fake totals, wrong statuses.
- Structural workbook problem: duplicate headers, stale formulas, wrong sheet identity, orphan IDs, broken summary logic.
- Native Excel presentation problem: row height, column width, AutoFit, print layout, clipping, merged-cell awkwardness.

In grading or submission pressure, content consistency and reviewer comprehension outrank cosmetic beauty.

Do not misread sparse decision tables as missing content. An `O` matrix, blank spacer columns, or intentionally empty A/B columns may be part of the template contract rather than a defect.

## Exemplar Calibration

If the user provides a strong reference workbook, inspect it first.

Extract the real quality bar from the exemplar:

- Header depth and sheet archetype
- Sentence specificity in preconditions, steps, and expected results
- Decision-table style and marker semantics
- Traceability fields, execution evidence fields, and numbering style
- What counts as explicit enough for a grader or reviewer

Use the exemplar to calibrate explicitness and reviewer readability. Do not blindly clone irrelevant structure.

## Clinical Translation Layer

When the workbook is messy, translate it into a clean intermediate understanding before judging it.

Good translation forms include:

- CSV exports per sheet
- Markdown or plain-text sheet inventories
- Script-generated row dumps
- Counts, marker maps, and workbook summaries

This intermediate view should be lossless enough to preserve:

- Sheet order and identity
- IDs and numbering schemes
- Cross-sheet relationships
- Marker placement
- Formula-bearing versus value-bearing areas

Reason clinically on the translated view, then map repairs back to the real workbook or the source generator.

## Generator-First Repair

If the workbook is generated, translated, or rebuilt from scripts, fix the source path first.

Default order:

1. Patch the generator, template, or transformation script.
2. Rebuild the workbook.
3. Regenerate translated or inspection exports.
4. Verify the live workbook object.
5. Refresh the packaged deliverable.

Do not hand-edit packaged copies while leaving the generator stale unless the workbook is truly manual and non-regenerable.

## Semantic Drift Checks

Do not trust keyword heuristics blindly when classifying or generating scenario wording.

Common failure mode:

- a mutation case gets mislabeled as read-only because the text contains words such as `review` or `receipt`
- a shared fallback template leaks success language into a failure scenario, or vice versa

When wording is generated, validate semantics against:

- the intended state change
- the neighboring rows in the same pattern
- the actual task requirement or source-of-truth rule

Meaning beats keyword matches.

## Dual-Layer Verification

Verify on both layers.

Inspection-export layer catches:

- Visible wording drift
- Broken IDs
- Missing rows
- Duplicate headers
- Traceability gaps

Live-workbook layer catches:

- Hidden rows and columns
- Freeze panes and sheet identity
- Merged ranges
- Formula persistence
- Row heights and column widths
- Stale cell values that survived a failed clear operation

If an edit seems ignored, inspect the actual workbook object instead of assuming the export tells the whole truth.

## Grader-Facing Proof Path

Make the verification path obvious inside the deliverable.

- If critical flows or subsets are hard to locate, add or repair a coverage or traceability sheet.
- Point review notes to exact proof surfaces inside the workbook package.
- Keep the master list, detail sheets, and summary markers aligned.
- Reduce reviewer hunting. The grader should be able to find the key proof path in minutes, not wander through exports and backups.

## Output And Package Hygiene

Treat workbook delivery as a packaging problem, not just an editing problem.

- Keep one clearly named active submission folder.
- Distinguish active deliverables, source generators, translated inspection exports, and backups.
- Refresh packaged copies after rebuilds.
- Verify packaged copies, not just workspace originals.
- Keep companion notes honest. Review notes, handbooks, and coverage summaries must describe the current packaged state, not an earlier build.
- When safe and explicitly desired, archive or remove stale duplicate outputs so the active path is obvious.

## Honest Automation Boundary

Stop automatic changes when the remaining issue is primarily native Excel behavior or human visual judgment.

Typical boundary examples:

- True AutoFit polish
- Print layout adjustments
- Subtle merged-cell aesthetics
- Reviewer-preference spacing tweaks

At that point:

- State the boundary plainly.
- Do not fake confidence.
- Provide a manual finishing handbook with exact sheets, rows, or actions.

## Anti-Patterns

- Editing visible rows without checking formulas below the fold
- Treating formatting complaints as layout-only before auditing content truth
- Adding tests without understanding the ID scheme
- Patching packaged copies while leaving generators stale
- Verifying source workbooks but not packaged deliverables
- Leaving multiple competing `final` folders with no obvious active deliverable
- Converting everything to CSV and losing workbook logic that mattered
- Treating empty cells as harmless when they break traceability
- Reporting coverage based on row count alone
- Marking work complete without reconciling summaries against detailed sheets
- Filling missing execution evidence with invented values
- Renaming headers casually when downstream formulas or scripts depend on exact text
- Burning time on cosmetic tuning after the real content defects are already fixed

## Output Contract

When using this skill, produce outputs in this order:

1. Workbook type, task mode, and source of truth
2. Observed workbook contract and active deliverable path
3. Key findings or the repair plan
4. Edits performed or recommended
5. Rebuild, package, and validation results
6. Remaining gaps, assumptions, risks, and manual boundary if any

If no edits were made, return a sharp audit, not a generic overview.

## Ready-To-Use Invocation

Use prompts like:

- `Audit this Excel test case workbook for structural errors, missing coverage, fake-success reporting, and stale duplicate deliverables.`
- `Use this reference workbook as the explicitness bar, then repair my QA workbooks to match that clarity without breaking the workbook contract.`
- `Translate these messy testing workbooks into a clinical intermediate representation, find the real defects, and fix the generators rather than hand-editing the packaged copies.`
- `Separate content defects from Excel AutoFit limitations, fix everything automatable, then write the manual finishing handbook.`
- `Create a clean submission-ready proof path for the critical test subset and reconcile the packaged copies against the source workbooks.`

## Success Standard

This skill is successful when the workbook becomes more truthful, more explicit, more structurally consistent, and easier for a reviewer to verify, with one clean active deliverable path and an honest boundary between what was automated and what still requires Excel-native manual polish.