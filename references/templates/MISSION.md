# Mission: <name>

## Goal And Boundaries
- Goal and observable outcome: <outcome>
- Source of goal/plan: <request or target-local path and section>
- Authority sources and acceptance owner: <sources, owner, required reviews>
- Existing authorization: <source and permitted actions>
- Further decision required for: <specific boundary or none known>
- Permitted work and exclusions: <bounds>
- Worker limit: 2 maximum initially; serial if unavailable
- Shared resources and assignments: <resource -> owner/task or none>
- Host capabilities and limits: <files, commands, workers, scheduling; observed limits>
- Target runtime guide: <local path>

## Current Summary
- Control state: ACTIVE | PAUSED | COMPLETE
- Accepted progress: <short summary with evidence links>
- Decisions needed: <concrete question or none>
- Next action: <one action>
- Last reconciled: <time and actual state checked>

## Tasks

| ID | Deliverable | Depends on | Assigned agent | Task card | State |
| --- | --- | --- | --- | --- | --- |
| T01 | <bounded outcome> | none | lead | tasks/T01.md | TODO |

Task states: TODO, RUNNING, REVIEW, DONE, BLOCKED. The lead owns this table. DONE requires acceptance evidence, required owner review, and authorized integration/delivery. Workers submit results, not final mission status.

## Worker Recovery

| Task | Native worker ID | Actual workspace/output path | Last observed state | Last reconciled |
| --- | --- | --- | --- | --- |
| T01 | none | <actual path> | <observed state> | <time> |

Use `none` only after verifying no worker was started. Use `unknown` for possibly dispatched work whose identity/state is unresolved. Reconcile before replacing it.

## Optional Continuation
- Requested by: <authorization source or not requested>
- Host/native continuation ID: <actual ID or none/unknown>
- Cadence and availability requirements: <observed host requirements or not applicable>
- State: <not requested | unavailable | configured | observed operational | paused | disabled>
- Last observed continuation: <time and evidence or none>
- Resume/pause/completion handling: <native control and current state>

Runtime records belong to the target's permitted storage. Detailed evidence belongs in task-specific output directories. This page coordinates execution; it does not replace authoritative source documents.
