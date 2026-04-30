# Framework: Agentic Hands Stack 2026

# Agentic Hands Stack 2026 (Cloud, Poor, Realistic)

> This document defines **hands** only: the execution layer that touches files, shells, and APIs under constraints you control.
>
> It assumes broke-student budget, weak hardware, no local models, and unstable cloud providers.

---

## 0. Scope and Intent

This is not a general “AI stack” guide. It is a **design spec for the hands layer**:

- How code-editing agents are wired.
- How they interact with models.
- How they are constrained so they remain useful under harsh limits.

The **web brain** (systems that think, plan, and negotiate goals) is assumed to exist elsewhere. Hands consume plans and missions; they do not create them.

The goal is **maximum capability inside hard constraints**, not “dumbness”. A good hand can make local decisions (ordering edits, deciding which test to run) as long as it respects:

- The mission you gave it.
- The boundaries you enforced.
- The quotas and failure modes of the underlying providers.

---

## 1. Constraints (Non-Negotiable)

1. **Budget**: \$0–\$16/month. Any recurring cost must justify itself against that ceiling.
2. **Hardware**: low-end laptop. **No local Ollama or heavy models**; CPU-only is assumed worthless for serious coding agents at your scale.[file:1]
3. **Cloud reality**:
   - Free tiers quote generous RPD/RPM but **enforced limits are often much tighter** under load.[web:7][web:16]
   - Gemini CLI and API show hard 429 behaviour and known rate-limit bugs; OpenRouter free models are frequently slow or unavailable; Groq free has hard walls and latency spikes.[web:56][web:57][web:59][web:69][web:73][web:19][web:24]
4. **ToS**: no deliberate multi-account abuse. Providers are tightening detection and bans for “limit evasion” across email/IP/device.[web:23][web:40]
5. **Reliability model**: every provider is treated as **intermittent and hostile**. Hands must fail safely when an endpoint stalls or returns errors mid-run.

---

## 2. Architecture: Brain vs Hands

### 2.1 Roles

- **Brain (out of scope here)**
  - Chooses what to build and why.
  - Writes and owns `PLAN.md` and high-level design.
  - Allocates work to hands.

- **Hands (this document)**
  - Operate on concrete artefacts: files, tests, commands.
  - Execute within explicit missions (tasks) defined by the brain.
  - Are allowed **local tactical decisions** (e.g., which failing test to fix first) but never change scope or goals on their own.

### 2.2 Artefacts

Every repo under this regime maintains:

- `PLAN.md` – problem definition and high-level plan (brain-owned).
- `TASKS.md` – queue of granular tasks, each referencing specific files and acceptance criteria.
- `HANDS_LOG.md` – chronological log of all automated actions: tool, model, files touched, outcome (tests, lints).

Hands:

- May **read** `PLAN.md` for context.
- May **consume and update status** in `TASKS.md`.
- Must **append** to `HANDS_LOG.md` after each mission.
- May **not rewrite** the intent section of `PLAN.md`.

---

## 3. Tool Viability (2026, Under Pressure)

This section is intentionally pessimistic. A tool only qualifies as a candidate hand if it has passed through public failure reports and remains usable under constrained, supervised usage.

### 3.1 Gemini CLI (Google)

**Strengths**:

- Account-based Gemini Code Assist / CLI gives access to Pro-level models with substantially higher limits than the bare developer free-tier (Flash-only) API.[web:36][web:67]
- Good code understanding, cross-file reasoning, and integration with editors.

**Critical weaknesses**:

- GitHub issues describe a **broken rate-limit handler**: once quota is exceeded, the CLI can enter a permanent 429 loop and must be manually killed.[web:57][web:60]
- Community reports of hitting rate limits after a handful of commands, sometimes on new accounts, contradict optimistic marketing limits.[web:56][web:59][web:64]
- Under heavy usage, model switching and degraded behaviour can appear without clear signalling.[web:56][web:58]

**Hands usage in this stack**:

- Use for **short, well-scoped missions**:
  - “Edit `fileA` and `fileB` to implement this specific change.”
  - “Read this test output and propose a minimal patch.”
- Always called through a **wrapper** that sends one request per mission and terminates the CLI process after the response.
- Never allowed to run open-ended, long-lived autonomous loops.

### 3.2 Groq Free API

**Strengths**:

- Published free limits (~30 RPM, ~1000 RPD for 70B models) are roughly honoured in practice.[web:19][web:21]
- Low latency when capacity is available.

**Critical weaknesses**:

- When a limit is hit, the API returns hard 429s; there is no graceful queueing.[web:24][web:27]
- Community reports describe noticeable latency spikes and quality variance under heavy shared load, especially on free endpoints.[web:66]
- Model portfolio is focused on Llama/Qwen/Gemma; good for coding, weaker for complex multi-step reasoning compared to closed frontier models.[web:21][web:26]

**Hands usage**:

- Treat as a **code generator**, not a planner:
  - Implement functions from a known spec.
  - Perform single-file refactors.
  - Generate docstrings and tests.
- Missions routed here must be **independent and idempotent**; a 429 should not corrupt state.

### 3.3 OpenRouter (with or without credits)

**Without credits**:

- `:free` models limited to ~50 requests/day, which the community consistently finds too low for serious workflows.[web:14][web:70][web:72]
- Reports of free models becoming slow, disappearing, or suffering frequent timeouts as demand spikes.[web:69][web:73][web:76]

**With small paid buffer (\$5–\$10)**:

- `:free` models gain access to ~1000 RPD, making DeepSeek V3 and similar models realistically usable.[web:14][web:71][web:82]
- Remaining issues are mostly upstream (individual models) rather than the router itself.[web:69][web:82]

**Hands usage**:

- At \$0, this is not reliable enough for the hands layer.
- At **\$5 once**, it becomes a candidate **secondary engine** for difficult missions when Gemini CLI or Groq are blocked, but still under the same “short mission” constraints.

### 3.4 GitHub Copilot (Student / Pro)

**Current reality (April 2026)**:

- GitHub has paused new individual Copilot plan sign-ups and is migrating all plans to usage-based billing.[web:15][web:40]
- Student plans now offer limited monthly “premium requests” for chat/agentic features; inline completions remain more generous but are not immune to internal throttling.[web:32][web:37]

**Hands usage**:

- Only for **inline completions while you manually type**, not as an autonomous hand.
- Not used for structured missions in this stack.

### 3.5 Cline / Roo / Kilo and similar shells

**Community signal**:

- April 2026 thread: *“Cline and Roo Code are dying projects”* – developers report slow maintenance and unreliable behaviour.[web:65]
- Roo Code has an open issue where it fails to respect configured rate limits, sending more requests than intended.[web:61]

**Verdict**: excluded from this stack. Hands must be predictable about API usage.

---

## 4. Chosen Hands Stack (Cloud-Only, Within Constraints)

Given the above, the **execution layer** is:

- **Editor shell**: Continue.dev in VS Code.
- **Terminal shell**: small custom scripts that call Gemini CLI / Groq / (optional) DeepSeek via APIs.
- **Engines**: Gemini CLI, Groq free, and optionally OpenRouter with a small credit buffer.

### 4.1 Editor Hands: Continue.dev

Continue.dev is used as a **file-scoped editing hand**:

- You explicitly select files or code regions.
- You supply the mission (from `TASKS.md`).
- Continue passes this to a configured engine and applies the returned edits.

**Rules:**

1. Continue sees at most:
   - The current file(s).
   - The relevant task description.
   - Any immediately related test file.
2. Continue is never given an open-ended goal like “clean up the project” or “follow PLAN.md end-to-end”.
3. All edits are reviewed with git diff before commit.

This keeps the agentic behaviour local: powerful within a small slice of the repo, never free-ranging.

### 4.2 Terminal Hands: Scripted Missions

The terminal layer consists of **human-visible scripts** that orchestrate simple loops around APIs. A typical mission script:

1. Reads one task from `TASKS.md`.
2. Collects the minimal context (paths, snippets, test output).
3. Builds a prompt.
4. Calls a single engine once.
5. Applies a patch (via `git apply` or an equivalent safe method).
6. Runs tests relevant to that task.
7. Logs the result to `HANDS_LOG.md`.

No script:

- Spawns an unbounded loop.
- Calls multiple engines concurrently for the same mission.
- Modifies unrelated files.

All control flow remains observable and interruptible in your terminal.

---

## 5. Operating Rules for Hands

These rules define how hands behave regardless of which engine they call.

### 5.1 Task Granularity

- Each task in `TASKS.md` references **specific files** and a small, testable change.
- Examples:
  - "Add `validateUser` helper in `auth.ts` and update `auth.test.ts` accordingly." 
  - "Refactor `parseConfig` in `config.ts` to remove duplicated logic; all tests must still pass."
- No task is allowed to span an entire subsystem or multiple directories.

### 5.2 Budget and Limits

- Daily API budget for the hands layer is explicitly tracked (e.g. 200 requests total).
- Per-provider safeguards:
  - At most one retry after a 429 or network failure.
  - If a provider returns two consecutive 429s within minutes, that provider is considered **cooling down** and is not used again that day for hands.
- Missions are prioritised so that **high-value tasks** (unblocking work, fixing failing tests) are executed before low-value tasks (style tweaks, docstrings).

### 5.3 Failure Containment

Before running any mission:

- Commit a clean state or create a dedicated branch for hands work.

After each mission:

- Inspect the diff.
- Run relevant tests.
- Append an entry to `HANDS_LOG.md`:
  - Timestamp.
  - Provider and model.
  - Files touched.
  - Outcome (pass/fail, notable issues).

If a mission produces low-quality or harmful changes, you revert and mark that combination of prompt + provider as untrustworthy for similar tasks going forward.

### 5.4 Autonomy Boundaries

Hands are allowed to:

- Decide the order in which to edit multiple related functions in the **same file**.
- Decide which failing assertion to address first within a given test suite.
- Introduce small helper functions when necessary to complete a task, if they remain scoped to the same module.

Hands are not allowed to:

- Modify project-wide architecture (e.g., move frameworks, change build system).
- Alter `PLAN.md` intent.
- Add new tasks to `TASKS.md` without human review.
- Introduce new external dependencies.

---

## 6. Anti-Patterns (What This Stack Refuses to Do)

1. **Long-lived autonomous agents** that claim to “own” a feature from start to finish. In practice, rate limits, context bugs, and flakiness break these runs mid-way, and recovery is messy.[web:56][web:57][web:78][web:81]
2. **Hidden loops inside shells** that issue dozens of requests without surfacing control to you. This is exactly how quotas are silently exhausted.[web:57][web:61]
3. **Assuming free-tier marketing numbers are sustainable**. Actual enforceable limits are lower and dynamic.[web:7][web:16][web:69]
4. **Chasing every new agent framework**. Most are thin wrappers over the same unstable APIs, adding additional failure modes on top.
5. **Treating hands as architects**. The more they decide, the more your system inherits their failure modes and hallucinations.

---

## 7. Summary: What “Best Within Constraint” Looks Like

- Hands are **as capable as the constraints allow** inside a narrow mission box.
- They can coordinate multiple edits and tests, but only for a small, clearly-defined slice of the repo.
- They treat cloud models as unreliable collaborators: powerful, but prone to rate limits, stalls, and occasional nonsense.
- You retain ownership of direction, decomposition, and quality.

This markdown is not a promise of perfection. It is a specification for an execution layer that **continues to be useful** when:

- Free tiers get tightened again.
- One provider has a bad week.
- A shell stops being maintained.

If a new tool or provider wants to join this stack, it must be evaluated against the same criteria: survive public failure reports, behave predictably under constraints, and respect the separation between brain and hands.
