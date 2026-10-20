# Task <ID>: <deliverable>

## Outcome And Acceptance
- Exact outcome: <what must exist or be true>
- Goal/source anchors: <request or relevant paths and sections>
- Prerequisites: <inputs, tasks, decisions>
- Acceptance criteria and owner: <observable checks, evidence, required reviewer>

## Inputs And Boundaries
- Target workspace/repository: <actual path; repository optional>
- Assigned agent and role: <lead or JARVIS worker>
- Input baseline: <material versions/hashes or other provenance; include needed working changes>
- Required inputs: <paths, availability, permitted data boundary>
- Allowed write paths: <disjoint scope>
- Output/evidence directory: <task-specific location>
- Shared resources: <assignments or none>
- Existing authorization: <source and permitted actions>
- Restrictions and escalation boundary: <data, spending, tools, external actions, approvals>
- Retry class: <idempotent | inspect-first local | authoritative external status required>
- Retry proof: <check, status source, or idempotency key; what resolves uncertainty>

## Current Checkpoint
- Short plan: <bounded steps>
- Observed progress: <what exists and what was verified>
- Next action: <one action>
- Unresolved problems: <specific blockers or none>
- Last checkpoint: <time>

## Result For Lead Review
- Actual changed paths/deliverables: <paths or none>
- Checks/commands and results: <what actually ran; distinguish proposed checks>
- Evidence paths: <outputs, logs, diffs, review evidence>
- Limitations: <unverified/excluded work>
- Required acceptance/integration remaining: <steps or none>
- Worker recommendation: REVIEW | BLOCKED | no change

Use not applicable with a reason for fields irrelevant to this domain. The mission table owns task status. Workers cannot edit central state, spawn workers, or mark the mission task DONE.
