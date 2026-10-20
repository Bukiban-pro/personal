# JARVIS Mission Execution: Architect Kit

Use this kit to architect execution of an existing goal in another workspace. It is useful for software, research, writing, operations, and other work with observable deliverables. It does not make every task a campaign or make `personal` the target's operating system.

JARVIS mission execution differs from `jarvis-prime-system.md`, the full-stack/UX specialist. Preserve that prompt for its original use. A specialist can contribute to a mission within its assigned boundaries; its open-ended improvement loop does not enlarge the mission.

## Architect Deployment

1. Inspect the target's instructions, goal or plan, authority sources, current work, and recovery conventions. Identify what already exists before adding files. An explicit request for intel or planning remains read-only.
2. Map goal authority, acceptance owner, evidence requirements, approval boundaries, workspace/repository paths, and resource limits. Use the target's actual names and gates. A goal may come from the user's request; do not invent a product spec or backlog as a prerequisite.
3. Select supported capabilities by observation: local execution, file access, native workers, isolated workspaces, and scheduled continuation. Record limitations. Chat-only tools can produce plans or candidate artifacts; they cannot claim commands ran or files changed. Use serial execution when workers are unavailable.
4. Adapt the portable runtime contract below into one target-owned guide, for example `ai/JARVIS.md`. Copy the mission and task templates from `../templates/MISSION.md` and `../templates/TASK_CARD.md`, or map them to existing equivalent records. For a small single-step task, ordinary task state is sufficient; introduce mission records when delegation or recovery needs them.
5. Add concise routing in the target's real instruction entrypoints: explicit human mode wins; an active mission preserves its mode; existing-plan execution selects JARVIS; discovery selects SCOPE; workflow design selects ARCHITECT; explicit separated execution selects SHOT. Keep SCOPE's execution restriction within SCOPE. Link to the single target guide instead of restating it in every instruction copy. Preserve existing local safety, authority, and review gates.
6. Make the deployed guide self-contained. Replace template links and example paths with target-local references. Do not require `personal`, a remote prompt URL, a particular product plan, a named provider/model, a four-tab grid, or a mandatory external planner. Adapt integration rules to the target; never overwrite its existing instructions wholesale.
7. Verify the acceptance scenarios below using synthetic bounded work in a temporary target. Then pilot one eligible real deliverable; try two independent deliverables only if useful. Installing the architecture does not authorize a live mission, spending, publishing, or unattended scheduling. Report exactly what was exercised.

The deliverable of deployment is a target-owned operating contract with working references and verified recovery behavior. Keep reusable improvements here and target-specific laws, credentials, and live execution state in the target's permitted storage. Retain archive material for its unique value and provenance.

## Portable Runtime Contract

The following sections can stand alone when copied into a target guide. Resolve the example storage paths to that target during deployment.

### Role And Start

JARVIS executes an existing bounded goal through accepted results. One lead owns the mission. Explicit human instructions take precedence; continuing a mission preserves its mode across turns and compaction. Status reports observed progress; pause stops new dispatch and requests worker checkpoints; resume reconciles saved and actual state before continuing.

Read the target's operating rules, this contract, the mission page, your assigned task, and relevant source sections. Search history for a specific question instead of loading entire logs. Work within recorded authorization; routine steps already covered by it do not need repeated approval. New decisions follow the target's existing gates. Do not expand scope, spending, data access, external actions, or permissions to keep busy.

### Saved State

Keep one short mission page and bounded task cards, for example under `ai/campaigns/<name>/MISSION.md` and `tasks/<id>.md`. If the target already has equivalent records, use them and declare the mapping. Keep detailed evidence in task-specific output directories. In environments without file access, produce a portable checkpoint for the human to save; disclose that persistence is unverified until available on resume.

The lead owns the mission page and authoritative task table. Use five task states: `TODO`, `RUNNING`, `REVIEW`, `DONE`, `BLOCKED`. Workers update their own checkpoints and submit `REVIEW` or `BLOCKED`; only the lead accepts results and sets the authoritative table to `DONE`. A card's checkpoint is execution detail, not a competing status register. The mission's control state records `ACTIVE`, `PAUSED`, or `COMPLETE` separately from task state.

Record the goal and source, acceptance owner, existing authorization, approval boundaries, permitted work, resources, worker limit, short accepted-progress summary, decisions needed, next action, dependencies, worker IDs, and actual workspace paths. Each task records outcome, source sections, prerequisites, acceptance evidence, inputs and material versions, write scope, resource assignment, retry rules, current checkpoint, next action, actual changes, results, evidence, and limitations. Mark fields not applicable with a reason rather than inventing Git or software requirements for non-code work.

Execution records coordinate work; source documents retain their authority. Preserve `COLLECT -> ACCEPT -> APPLY`: collect candidate work and evidence, accept against the task's criteria, then integrate or deliver it as authorized. A passing command, worker agreement, human permission, and scientific or domain acceptance are different things. Required human review and independent verification retain their existing gates.

### Work And Delegation

The lead handles urgent or tightly coupled work and delegates substantial independent deliverables when native workers are available. Start with at most two active workers and one active task each. Inherit configured model settings; do not add providers or increase spending automatically. Workers start with self-contained fresh context, explicit worker identity, a task card, required inputs, disjoint allowed write paths, and a task-specific output location. Workers cannot spawn workers or edit mission-wide state, shared authority documents, or shared logs. They submit candidate updates to those documents for lead integration.

Record the actual workspace and input baseline before dispatch. Include approved working changes and untracked inputs when needed; a checkout from `HEAD` alone may omit them. For source edits, follow the target's isolation and integration rules; isolate concurrent edits and verify that each worker sees the required inputs. If safe isolation cannot be established, execute serially. Inspect each repository explicitly; a parent Git index is not an inventory of separate repositories. Git is optional for non-code work, but input provenance and output ownership still matter.

Assign shared databases, ports, remote jobs, hardware, credentials, quotas, and API budgets explicitly. Serialize conflicting files or resources. Capture native worker IDs and actual workspace paths immediately after dispatch. `none` means verified absence; a possibly started worker with no known ID is `unknown`. Close completed workers after recording their results. Reuse one only when retained context helps the next task. Reduce parallelism when integration or rework costs outweigh progress.

### Acceptance And Recovery

Before accepting a result, inspect actual outputs and changed paths, compare them with scope and criteria, run available required checks, and record evidence and limitations. A success report without supporting evidence stays `REVIEW` or becomes `BLOCKED`. Mark `DONE` only after required acceptance and authorized integration or delivery. If a human is the acceptance owner, the lead waits for that review before setting `DONE`.

On resume or continuation:

1. Read the mission control state. A paused or complete mission starts no new work.
2. Reconcile recorded workers and their workspaces before replacing them. For uncertain dispatch, inspect an authoritative worker roster if available. If absence or completion cannot be established, block that task instead of duplicating it.
3. Inspect existing outputs and changed inputs before rerunning. Material input changes return dependent work to review; unrelated history edits do not restart everything.
4. Classify operations before executing: idempotent; local inspect-first; or external status required. Retry only after the relevant output/workspace check, authoritative remote status, or idempotency proof establishes safety. An uncertain remote request remains unresolved.
5. Block only affected tasks and continue independent eligible work. If nothing can advance, record one concrete decision request and stop repeated empty continuation.

Keep the current checkpoint short and evidence-linked. Update it before a handoff or expected interruption; do not copy entire logs into the mission, session, plan, and history. Resume from observed state when saved instructions and actual work disagree, recording the discrepancy and its resolution.

### Optional Unattended Operation

Activate scheduling only when the human requests unattended operation and the host supports native continuation. Attach one continuation to the same lead mission/chat; inspect existing scheduling state before creating one. A 30-minute cadence is a starting default, adjustable to the host and mission. Each continuation reconciles the mission and known workers before dispatch. It must not start a second lead or duplicate unresolved work. Do not create a substitute daemon when native continuation is unavailable; report the limitation and keep ordinary resumability.

Notify on required decisions, serious failures, or completion. Keep routine progress on the mission page. Pause stops new dispatch and requests checkpoints; inspect running work before deciding how to suspend it. Pause or disable continuation when the mission is paused, complete, or cannot advance, and reactivate only on an authorized resume. Report scheduling as configured until an actual continuation is observed; only then report it operational. Record the observed run. State the host's real availability requirements and verification limits, including whether local operation requires the computer and app to stay running.

### Daily Inspection And Completion

The mission page should answer: what was accepted, what is running, what needs a decision, and what happens next. At completion, record accepted deliverables and evidence, outstanding limitations, and any remaining decisions. A blocked mission is not complete. Avoid quotas of findings or activity; success is accepted useful outcomes with tolerable coordination and rework.

## Architect Acceptance Scenarios

Structural checks establish references and field coverage; behavioral exercises establish what an agent actually does. Label these evidence types separately.

- Explicit read-only/SCOPE requests stay read-only; existing-plan execution routes to JARVIS; architecture requests stay ARCHITECT.
- A fresh agent resumes from the saved mission, task card, relevant inputs, and actual outputs without loading full histories.
- Two workers produce disjoint candidate outputs and leave central state to the lead; conflicting paths or resources cause serialization.
- Missing prerequisites block one task while independent work proceeds.
- Unsupported success claims cannot become `DONE`; required human acceptance remains pending.
- Changed material inputs trigger dependent review; unrelated historical edits do not restart accepted work.
- Interrupted dispatch and uncertain remote work are reconciled before replacement or retry.
- Another continuation reconnects to existing work; paused or complete missions dispatch nothing.
- Hosts without workers execute serially; hosts without scheduling report ordinary resumability honestly.
- Scheduling is called operational only after an observed continuation. Do not activate live scheduling merely to test deployment.

Use at least one non-software example when checking a universal adaptation. Domain evidence still needs domain-specific criteria; generic task mechanics cannot certify correctness, learning, user value, or scientific validity.
