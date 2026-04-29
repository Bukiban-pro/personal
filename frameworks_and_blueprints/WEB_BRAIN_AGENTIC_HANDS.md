# Web Brain, Agentic Hands

_A practical, offline-friendly arsenal for non‑agentic engineering of agentic workflows._

This document is designed to be the single reference you keep under your pillow: a blueprint you can use to implement and evolve a **web brain + agentic hands** system without redoing the research and reasoning.

The core idea:

> **Use dumb, universal automation to do all the clerical work _around_ the model, so the model spends tokens only on judgment.**

---

## 1. Mental Model

### 1.1 Roles

Think in terms of three actors:

- **Web brain**
  - Remote, powerful, expensive models (ChatGPT, Claude, Gemini, etc.).
  - Great at diagnosis, planning, weighing options, explaining trade‑offs.
  - Bad at: line‑by‑line file inspection at scale, raw log reading, anything that looks like `grep`.

- **Agentic hands**
  - Local automation: scripts, CLI tools, coding agents, editor integrations.
  - Great at: editing files, running tests, applying diffs, iterating quickly on small steps.
  - Bad at: global reasoning, system‑level design, deciding which path is best.

- **Bridge** (the system you are building)
  - Glue code and conventions that connect brain and hands.
  - Responsible for:
    - **Context engineering** (what enters the prompt).
    - **Artifact discipline** (what is stored between loops).
    - **Loop control** (when to call the web brain vs. keep working locally).

Your strategic objective:

> **Treat “AI reading big blobs of text” as a system smell.** If the model is scrolling, your bridge is failing.

---

## 2. Design Principles

These principles are non‑negotiable. Every tool, script, and convention in this arsenal should serve them.

### 2.1 Token Economy

1. **Token‑heavy work belongs to machines, not models**
   - Full‑file scans, log parsing, test output trimming, and diff inspection should be performed by scripts.
   - The model sees only **compressed, relevant slices**: selected lines, short summaries, and links/file paths.

2. **Context growth must be linear, not quadratic**
   - Each loop should **replace** raw history with compressed artifacts, not append everything forever.
   - Store raw data on disk; feed the model **handles** (paths, tags, IDs) plus small excerpts.

3. **Plan once, execute many**
   - A single web‑brain call should produce a structured plan that can drive many local steps.
   - Avoid “chatty” micro‑loops where the model is asked after every tiny edit.

### 2.2 Context Engineering

4. **Minimal sufficient context**
   - Always ask: _“What is the smallest information set the web brain needs to make a good decision here?”_
   - Prefer **structured packs** over raw dumps:
     - short task brief,
     - repo sketch,
     - focused scans,
     - key snippets.

5. **Externalized state, not swollen prompts**
   - All durable knowledge lives in files under `ai/`: plans, reports, lessons, loop logs.
   - The prompt references those artifacts by name and tag instead of re‑embedding all prior text.

6. **Evidence‑preserving compression**
   - Summaries must preserve:
     - file paths,
     - line ranges,
     - failing assertions,
     - commands executed,
     - what changed and why.
   - Summarize prose, never delete ground truth.

### 2.3 Operational Discipline

7. **One task, one tag**
   - Every serious task (feature, bug, QA sweep) gets a unique `<tag>` (e.g. `checkout-bug`, `feature-user-notes`).
   - All artifacts for that task are namespaced by `<tag>`.

8. **Every loop leaves a trail**
   - Plans, execution reports, and loop logs are kept as markdown under `ai/`.
   - You should always be able to reconstruct what happened and why.

9. **Automation before intelligence**
   - If a behavior is repeatable and deterministic, encode it in a script.
   - Only go to the web brain for ambiguity, design choices, or high‑level reasoning.

---

## 3. Directory Layout

Use this layout inside any project:

```text
ai/
  config/
    agents.md          # Permanent instructions & conventions for this repo
  templates/
    task-brief.md      # Template for human-authored task specs
    web-prompt.md      # Template for web brain prompt
    plan.md            # Template for web brain plans
    execution-report.md# Template for local agent execution reports
    context-pack.md    # Template for handoff context packs
  tools/
    repo-sketch.*      # Repo map generator (gitignore-aware)
    focus-scan.*       # Focused search by keyword/tag
    log-cut.*          # Log/test-output trimmer & summarizer
    diff-pack.*        # Diff summarizer for plans & reports
    question-pack.*    # Assembles context packs for web models
    apply-plan.*       # Agentic hands entrypoint (executes plans)
  out/
    repo-sketch.md     # Latest repo map
    focus-scan-*.md    # Focused scan results per tag
    context-*.md       # Context packs per tag (handoff-*.md or context-*.md)
    plan-*.md          # Plans returned by web models
    exec-*.md          # Execution reports from local agents
    lessons.md         # Accumulated “what we learned” across tasks
  logs/
    loop-log.md        # Chronological log of loops
```

Notes:

- `*.ps1`, `*.sh`, or `*.py` depending on your platform. The interface is what matters, not the language.
- `ai/` is versioned in git. It is part of the repo’s long‑term memory.

---

## 4. Core Artifacts

This section defines the contracts of the central markdown artifacts. Everything else (scripts, agents, prompts) should treat these as **interfaces**.

### 4.1 Task Brief (`ai/out/task-brief-<tag>.md`)

Ownership: **you** (human).

Goal: encode context in human language once, so the web brain and local agents never have to guess the basics.

Recommended structure:

```md
# TASK BRIEF — <tag>

## Goal
Explain in 2–3 sentences what success looks like.

## Context (human perspective)
- Where the bug/feature appears in the product
- Business impact (user pain, revenue, deadlines)
- Any relevant history (prior attempts, related tickets)

## Evidence you have
- Logs, errors, screenshots (summarized)
- User reports
- Links to previous tasks or docs

## Non-negotiables
- Files / modules NOT to touch
- Performance / security constraints
- Backwards compatibility requirements

## Definition of Done (DoD)
- [ ] Code changes in ...
- [ ] Tests updated/added in ...
- [ ] All relevant tests passing
- [ ] Docs / comments updated
```

The task brief is **never** generated by the model. It is your stable anchor.

### 4.2 Repo Sketch (`ai/out/repo-sketch.md`)

Ownership: automation (`repo-sketch.*`).

Goal: create a **compressed, gitignore‑aware map** of the repo.

Content sketch:

```md
# REPO SKETCH

## Root
- repo name: <repo>
- main language(s): <from extensions>
- frameworks: <from package/requirements>
- build command(s): <from package.json, Makefile, etc.>
- test command(s): <from package.json, tox, etc.>

## Directory Tree (gitignore-aware)
- src/
  - api/
  - core/
  - ui/
- tests/
- config/
- ...

## Key Config Files
- package.json
- tsconfig.json
- pyproject.toml
- docker-compose.yml
- .github/workflows/ci.yml

## File Counts
- .ts: 42
- .tsx: 18
- .py: 3
- .md: 7

## Notable Entry Points (guessed)
- src/main.ts
- src/server.ts
- frontend/src/main.tsx
```

Guidelines:

- Never dump a raw tree. Keep it to 2–3 levels deep.
- The web brain should be able to understand the repo’s shape in under a minute.

### 4.3 Focus Scan (`ai/out/focus-scan-<tag>.md`)

Ownership: automation (`focus-scan.*`).

Goal: map **where** in the repo a topic appears (e.g. `checkout`, `invoice`, `auth-token`).

Content sketch:

```md
# FOCUS SCAN — <tag>

## Query
- "checkout"

## Files with hits
- src/checkout/service.ts
  - L45: `processCheckout(...)`
  - L120: `validateCart(...)`
- src/routes/checkout.ts
  - L12: `router.post('/checkout' ...`
- tests/checkout.test.ts
  - L5: `describe('checkout flow', ...)`
```

Behavior:

- Use `rg`, `git grep`, or language‑aware search.
- Only consider tracked files (respect `.gitignore`).
- Show a handful of representative lines per file, not everything.

### 4.4 Context Pack (`ai/out/context-<tag>.md`)

Ownership: automation (`question-pack.*`).

Goal: assemble a **minimal, high‑signal bundle** that the web brain reads.

Content sketch:

```md
# CONTEXT PACK — <tag>

## 1. Task Brief
<inline content of task-brief-<tag>.md>

## 2. Repo Sketch (summary)
<inline content of repo-sketch.md — possibly trimmed>

## 3. Focused Relevance
<inline content of focus-scan-<tag>.md>

## 4. Key Snippets
```lang
// file: src/checkout/service.ts (L40–75)
...
```

```lang
// file: src/routes/checkout.ts (L8–40)
...
```

## 5. Questions for Web Brain
- Q1: Where is the most likely root cause?
- Q2: What files should we inspect or modify first?
- Q3: What tests or diagnostics should we run?
```

Snippets are where you apply the most judgment in automation: choose line ranges that show the **shape** of the code around relevant functions, not entire files.

### 4.5 Web Brain Plan (`ai/out/plan-<tag>.md`)

Ownership: web brain.

Goal: produce a **contract** that local agents can execute without further chatting.

Prompt template (stored at `ai/templates/web-prompt.md`):

```md
You are the WEB BRAIN in a "web brain, agentic hands" workflow.

- The code lives on my machine. You NEVER run code directly.
- Local agents will execute your plan and report back.
- You must be explicit, structured, and brutally practical.

You will receive a context pack with:
- TASK BRIEF
- REPO SKETCH (gitignore-aware tree & key configs)
- FOCUS SCAN (likely relevant files)
- KEY SNIPPETS

Your job:

1. Read the context pack carefully.
2. Identify likely root causes or design options.
3. Propose a plan that a local code agent can follow.

Your output must be in this exact format:

# PLAN — <tag>

## 1. Diagnosis
- Hypothesis 1
- Hypothesis 2
- Unknowns / open questions

## 2. Files to Inspect or Modify
- path/to/file — why it matters
- another/file — why it matters

## 3. Step-by-step Plan
1. Do X in file A (line range if known)
2. Do Y in file B
3. Run command(s): `...`
4. Verify with tests/logs
5. Stop and report if any surprise appears

## 4. Invariants and Constraints
- Things that MUST NOT change
- Checks to perform after each step

## 5. Validation & Rollback
- How to know it worked
- How to back out unsafe changes
```

The returned plan is saved as `ai/out/plan-<tag>.md` without modification.

### 4.6 Execution Report (`ai/out/exec-<tag>.md`)

Ownership: agentic hands (`apply-plan.*` + whatever agent you plug in).

Goal: capture exactly what the agent did, what passed/failed, and what evidence we have.

Recommended structure:

```md
# EXECUTION REPORT — <tag>

## Plan Steps & Status
1. Implemented X in file A
   - Status: success | failure | skipped
   - Files changed:
     - src/...
   - Notes: ...

2. Implemented Y in file B
   - Status: failure
   - Error: <stderr snippet>
   - Next suggestions: ...

## Commands Run
- `npm test` — ✅
- `npm run lint` — ❌ (failure, see logs below)

## Diffs Summary
- src/checkout/service.ts: added ...
- src/routes/checkout.ts: updated ...

## Questions / Blockers for Web Brain
- Q1: ...
- Q2: ...
```

This is what you feed back into the web brain in the next loop, usually merged into a fresh context pack.

### 4.7 Loop Log (`ai/logs/loop-log.md`)

Ownership: automation, updated at the end of each loop.

Goal: maintain a **chronological, low‑friction history** of what happened across loops.

Structure:

```md
# LOOP LOG

## <tag> — 2026-04-23T12:34
- Stage: handoff → plan
- Files: repo-sketch, focus-scan, context-pack
- Outcome: PLAN created

## <tag> — 2026-04-23T14:02
- Stage: plan → execution
- Result: 3/5 steps succeeded, tests failing
- Next: send EXECUTION REPORT to web brain
```

This file is not for the model; it’s for you.

### 4.8 Lessons (`ai/out/lessons.md`)

Ownership: both you and automation.

Goal: accumulate reusable insights over time: gotchas, better prompts, conventions.

Structure:

```md
# LESSONS

## [2026-04-23] checkout-bug
- Root cause: missing null check in ...
- Better diagnostics: run `npm test -- --testPathPattern checkout` before asking web brain.
- Prompt improvement: include the failing assertion in the context pack.

## [2026-05-10] search-latency
- Always check indexing config before changing query code.
```

Over months, this becomes the thing you actually keep under your pillow.

---

## 5. Tool Contracts (Bridge Layer)

This section defines the **interfaces** your scripts/tools must satisfy. Implementations can be in PowerShell, Bash, Python, or anything else.

### 5.1 `repo-sketch.*`

Responsibility:

- Produce `ai/out/repo-sketch.md`.
- Be `.gitignore`‑aware.

Behavior:

- Inspect the repo root.
- Detect languages and frameworks from:
  - file extensions,
  - `package.json`, `pyproject.toml`, `go.mod`, etc.
- Suggest build and test commands if discoverable.
- Generate a condensed tree, key configs, file counts, and entry points.

### 5.2 `focus-scan.*`

Signature (conceptual):

```text
focus-scan -Tag <tag> -Query "<string>"
```

Responsibility:

- Produce `ai/out/focus-scan-<tag>.md` for a given query.

Behavior:

- Run `rg`/`git grep` over tracked files.
- Group hits by file.
- Include 2–5 representative lines per file with line numbers.
- Skip vendor directories, build artifacts, and generated code.

### 5.3 `log-cut.*`

Responsibility:

- Turn large logs/test outputs into small, structured summaries.

Inputs:

- Raw log file path, or direct stdin piping.

Outputs:

- A snippet section you can paste into `exec-<tag>.md`, plus optional markdown under `ai/out/log-<tag>.md`.

Behavior:

- Extract:
  - failing assertions and stack traces,
  - repeated error messages (deduplicated),
  - the last N lines of context.
- Label each snippet with source (command, file) and time.

### 5.4 `diff-pack.*`

Responsibility:

- Summarize git diffs into human‑readable bullets for plans and execution reports.

Behavior:

- Use `git diff` between two refs or `HEAD` and `HEAD~1`.
- For each file, describe:
  - what kind of change (added/removed/modified),
  - dominant operations (new function, changed parameters, altered conditional, etc.).
- Output as markdown bullet lists that can drop directly into `## Diffs Summary`.

### 5.5 `question-pack.*`

Signature (conceptual):

```text
question-pack -Tag <tag>
```

Responsibility:

- Build the context pack at `ai/out/context-<tag>.md` by merging:
  - `task-brief-<tag>.md`,
  - `repo-sketch.md`,
  - `focus-scan-<tag>.md`,
  - selected snippets.

Behavior:

- If any source file is missing, warn loudly.
- Trim overly long sections (e.g. long repo sketches) by keeping the top N lines.
- Optionally include a **short summary section at the top** (generated via local model or simple heuristics) to orient the web brain.

### 5.6 `apply-plan.*`

Signature (conceptual):

```text
apply-plan -Tag <tag>
```

Responsibility:

- Read `ai/out/plan-<tag>.md`.
- Execute its steps locally.
- Produce `ai/out/exec-<tag>.md` and update `ai/logs/loop-log.md`.

Minimal behavior:

- Parse steps under `## 3. Step-by-step Plan`.
- For each step:
  - Open the relevant file(s).
  - Make edits (manually or via a local coding agent).
  - Run listed commands (tests, linters, etc.).
  - Capture output.
- At the end, generate an execution report with:
  - per‑step status,
  - commands run,
  - diff summary,
  - remaining questions.

`apply-plan` is where you plug in any agent you want (cursor, aider, custom LLM tooling). The outer contract remains the same.

---

## 6. Loop Shapes for Common Workflows

This section gives you **ready‑to‑run loops** for the three most common workflows: new feature, debugging, and QA.

### 6.1 New Feature Loop

Goal: design and implement a new feature with minimal web‑brain calls.

1. **Brief**
   - Create `ai/out/task-brief-<tag>.md`.
   - Be explicit about user experience, constraints, and DoD.

2. **Repo understanding**
   - Run `repo-sketch.*` once per repo (or when structure changes).

3. **Focus**
   - Pick a query (feature name, domain concept).
   - Run `focus-scan -Tag <tag> -Query "<feature-or-domain>"`.

4. **Context pack**
   - Run `question-pack -Tag <tag>` → generates `context-<tag>.md`.

5. **Plan (web brain)**
   - Copy contents of `context-<tag>.md` into your web model.
   - Paste `web-prompt.md` on top.
   - Get `PLAN — <tag>` and save as `ai/out/plan-<tag>.md`.

6. **Execution (agentic hands)**
   - Run `apply-plan -Tag <tag>`.
   - Let it edit files, run tests, and write `exec-<tag>.md`.

7. **Review & refine**
   - You review diffs + `exec-<tag>.md`.
   - If there are failures or open questions, integrate them into a new `context-<tag>.md` (including a summarized execution report) and repeat from step 5.

### 6.2 Debugging Loop

Goal: diagnose and fix a bug with aggressive evidence compression.

Differences from feature loop:

1. In the task brief, include:
   - exact error messages,
   - failing inputs,
   - reproduction steps.

2. Use `log-cut.*` early:
   - When tests or the application generate large logs, pipe them into `log-cut.*`.
   - Attach trimmed results to `exec-<tag>.md` or to the context pack.

3. Ask the web brain for:
   - likely root causes,
   - minimal diagnostic steps,
   - a branch‑by‑branch elimination strategy.

4. Let `apply-plan` execute the diagnostics:
   - run targeted tests,
   - add temporary logging,
   - rerun tests,
   - capture outputs via `log-cut.*`.

5. Feed only **summaries and key snippets** of logs back into subsequent context packs.

### 6.3 QA / Product Review Loop

Goal: evaluate a feature or release for quality issues without burning tokens on the entire codebase.

1. Brief
   - Describe what is being tested (feature, module, or release).
   - Include risk areas and quality bars.

2. Focus
   - Run one or more `focus-scan` invocations for key domains (`auth`, `billing`, `notifications`, etc.).

3. Context pack
   - Emphasize:
     - test suite structure,
     - critical paths,
     - known brittle areas.

4. Web brain
   - Ask for a **test strategy and test gap analysis**, not just “write tests”.

5. Execution
   - Use `apply-plan` to:
     - add missing tests,
     - improve assertions,
     - update documentation.

---

## 7. Anti‑Patterns and Smells

Use this section as a checklist. If any of these show up, the system is leaking tokens and attention.

1. **The model is reading entire files line by line**
   - Fix: add or improve `focus-scan` and snippet selection.

2. **Raw logs or test output are pasted verbatim into prompts**
   - Fix: route all logs through `log-cut.*` and include only labeled snippets.

3. **Context packs exceed a sensible size**
   - Fix: trim older sections, keep only:
     - task brief,
     - minimal repo sketch,
     - current focus scan,
     - latest relevant snippets.

4. **Multiple agents receive the same giant context**
   - Fix: give each specialist a **narrow pack** (subset of files and snippets), and a single shared summary.

5. **You can’t tell what happened last loop**
   - Fix: enforce execution reports and loop log updates.

6. **The web brain is being asked to “please write code for X” without a plan**
   - Fix: always go through `PLAN — <tag>` first.

---

## 8. Implementation Layers

To actually implement this arsenal, approach it in three passes:

### 8.1 Pass 1: Manual but structured

- Create `ai/` with:
  - `config/agents.md`
  - `templates/` (task brief, web prompt, plan, execution report, context pack)
  - empty `out/` and `logs/`.
- Manually:
  - write task briefs,
  - run `rg` / `fd` commands,
  - assemble context packs,
  - paste into web brain,
  - write execution reports.

You’re just following the shape of the system by hand.

### 8.2 Pass 2: Script the repetitive parts

Automate:

- repo sketch,
- focus scan generation,
- context pack assembly,
- log cutting,
- diff summaries,
- loop log updates.

Keep the web brain prompt and plan format unchanged; you’re only automating the bridge.

### 8.3 Pass 3: Plug in agentic hands

Finally:

- Implement `apply-plan.*` as a thin shell around whatever agent you prefer (editor plugin, CLI agent, custom scripts).
- Ensure it always:
  - reads `plan-<tag>.md`,
  - writes `exec-<tag>.md`,
  - appends to `loop-log.md`.

At this point, you have:

- **Web brain**: remote model using a curated context pack.
- **Bridge**: your `ai/` arsenal.
- **Hands**: local agents obeying a plan contract.

---

## 9. Quickstart Checklist

When you pick up this markdown offline, without re‑thinking everything, follow this checklist for each substantial task:

1. Choose a `<tag>`.
2. Copy `templates/task-brief.md` to `ai/out/task-brief-<tag>.md` and fill it in.
3. Run `repo-sketch.*` (if not already fresh).
4. Run `focus-scan.*` for your domain keyword(s).
5. Run `question-pack.*` to generate `context-<tag>.md`.
6. Paste `context-<tag>.md` + `web-prompt.md` into your web model.
7. Save the returned plan as `ai/out/plan-<tag>.md`.
8. Run `apply-plan.* -Tag <tag>`.
9. Inspect `exec-<tag>.md` and diffs.
10. If needed, create a new `context-<tag>.md` that includes a summary of the execution report and repeat from step 6.
11. Periodically update `lessons.md` with anything worth remembering.

Do this consistently and your agents will rarely, if ever, do manual work the bridge can automate.
