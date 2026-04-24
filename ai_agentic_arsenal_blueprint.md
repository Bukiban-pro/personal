# AI Agentic Arsenal Blueprint

A concrete arsenal for a **web brain + agentic hands** system. Includes repo layout, commands, and templates.

## 1. Minimal AI Arsenal Layout
Inside any project, add an `ai/` directory with this structure:

```text
ai/
  config/
    agents.md          # Permanent instructions & conventions
  templates/
    task-brief.md
    handoff.md
    web-prompt.md
    plan.md
    execution-report.md
  out/
    repo-sketch.md     # Latest repo map
    focus-scan-*.md    # Focused grep results
    handoff-*.md       # Context packs sent to web models
    plan-*.md          # Plans returned by web models
    exec-*.md          # Execution reports from agents
    lessons.md         # Accumulated “what we learned”
  logs/
    loop-log.md        # Every loop gets an entry
  tools/
    repo-sketch.ps1
    focus-scan.ps1
    question-pack.ps1
    apply-plan.ps1     # Agent entrypoint (your agent will implement)
```

You treat `ai/` as **context + contracts as code**. It’s git‑tracked, versioned, and always present.

***

## 2. Gitignore‑aware repo sketch (better than `tree`)

### Tool: `repo-sketch.ps1`

Goal: produce a **gitignore‑aware, noise‑reduced map** of the repo as `ai/out/repo-sketch.md`.

On Windows 11, use **`fd`** or **`erdtree`**, both of which can respect `.gitignore`. `fd` defaults to gitignore‑aware search inside git repos, so you don’t pull in `node_modules`, `dist`, etc.  `erdtree` is a modern `tree` replacement that’s git‑aware and can show hierarchical structure while respecting ignores.[^1][^2][^3]

Pseudo‑behavior:

- Use `fd` to list files (gitignore‑aware).
- Aggregate by directory, file type, and size.
- Find key root configs (`package.json`, `pyproject.toml`, `docker-compose.yml`, `README*`, `.github/workflows/*`).
- Write a markdown file with sections.

Target output (sketch):

```md
# REPO SKETCH

## Root
- repo name: <repo>
- main language(s): <guessed from extensions>
- frameworks: <guessed from package/requirements>
- build command: <if known>
- test command: <if known>

## Directory Tree (gitignore-aware)
<compact tree, 2–3 levels deep, from fd/erd>

## Key Config Files
- package.json
- tsconfig.json
- docker-compose.yml
- .github/workflows/ci.yml
- ...

## File Counts
- .ts: 42
- .tsx: 18
- .py: 3
- .md: 7
- ...

## Notable Entry Points (guessed)
- src/main.ts
- src/server.ts
- frontend/src/main.tsx
```

Your agent can implement this using `fd` + some PowerShell to shape the markdown. The important part: **gitignore‑aware**, and **compressed**, not a raw wall of paths.[^2][^3][^1]

***

## 3. Focused relevance scan

### Tool: `focus-scan.ps1`

Goal: given a keyword or feature name, produce `ai/out/focus-scan-<tag>.md` with **only the likely relevant files** and matching lines.

Behavior:

- Input: `-Tag "checkout-bug"` and `-Query "checkout"`.
- Use `rg` or `git grep` to search only tracked files.
- For each matching file, record:
    - Path
    - Short reason (first few matches)
    - Line numbers

Output sketch:

```md
# FOCUS SCAN — checkout-bug

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

This becomes a **priority list** for web models and agents, instead of blindly reading everything. It’s aligned with research where agents first **rank candidate files** before deep reading.[^4][^5][^6]

***

## 4. Task brief template (you fill this)

### Template: `templates/task-brief.md`

This is where *you* flex as strategist. Every serious task gets a brief:

```md
# TASK BRIEF — <short name>

## Goal
Explain in 2–3 sentences what success looks like.

## Context (human perspective)
- What you know already
- Where the bug/feature shows up
- Business impact / constraints

## Evidence you have
- Error messages
- Logs
- User reports
- Related tickets / TODOs

## Non-negotiables
- Files / areas NOT to touch
- Performance / security constraints
- Backwards-compat requirements

## Definition of Done (DoD)
- [ ] Code changes in ...
- [ ] Tests updated/added in ...
- [ ] All tests passing
- [ ] Docs / comments updated
```

You can duplicate this template into `ai/out/task-brief-<tag>.md` per task.

***

## 5. Handoff context pack for web models

### Tool: `question-pack.ps1`

Goal: combine existing artifacts into **one context file** for web models: `ai/out/handoff-<tag>.md`.

It should merge:

- `task-brief-<tag>.md` (your spec)
- `repo-sketch.md` (global map)
- `focus-scan-<tag>.md` (relevance hits, if any)
- Optional: inlined snippets from a few key files

Result skeleton:

```md
# HANDOFF — <tag>

## 1. Task Brief
<verbatim from task-brief>

## 2. Repo Sketch (summary)
<verbatim from repo-sketch>

## 3. Focused Relevance
<verbatim from focus-scan-<tag>>

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

- Q1: ...
- Q2: ...
- Q3: ...

```

This is your **context pack**. It’s exactly the kind of structured input that context-engineering guides recommend: small, dense, and task-specific instead of massive and noisy.[^7][^8][^9]

***

## 6. Prompt template for web models

### Template: `templates/web-prompt.md`

This is the message you paste into Gemini/Claude/ChatGPT along with `handoff-<tag>.md`:

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
2. Identify likely root causes / design options.
3. Propose a plan that a local code agent can follow.

Your output must be in this exact format:

# PLAN — <tag>

## 1. Diagnosis
- Hypothesis 1
- Hypothesis 2
- Uncertainties / what we still don't know

## 2. Files to Inspect or Modify
- file path — why it matters
- file path — why it matters

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

You always ask for a **plan as a contract**, not “code please.” This is 10× easier to feed into an agent.

***

## 7. Plan storage \& split

When the web model responds, you paste its output into `ai/out/plan-<tag>.md`.

If the plan is big, you can optionally mark steps:

```md
## 3. Step-by-step Plan

1. [ ] Implement ...
2. [ ] Implement ...
3. [ ] Implement ...
```

So an agent (or you) can tick off items and update the file.

***

## 8. Agent entrypoint: `apply-plan.ps1`

This is the “agentic hands” side. You don’t implement the agent; you define the **interface** it must follow.

### Contract for `apply-plan.ps1`

```
- Input: `-Tag <tag>`, reads `ai/out/plan-<tag>.md`.  
```

- Responsibilities (for the agent behind it):
    - Parse the plan sections.
    - For each step:
        - Open the mentioned files.
        - Edit them according to instructions.
        - Run any commands listed (`npm test`, `pytest`, etc.).
        - Capture outputs (pass/fail, errors).
    - Write `ai/out/exec-<tag>.md` summarizing exactly what happened.

Target `exec-<tag>.md` structure:

```md
# EXECUTION REPORT — <tag>

## Plan Steps & Status
1. Implemented X in file A
   - Status: success
   - Files changed:
     - src/...
   - Notes: ...
2. Implemented Y in file B
   - Status: failed
   - Error: <stderr snippet>
   - Next suggestions: ...

## Commands Run
- `npm test` — ✅
- `npm run lint` — ❌ (failure, see logs)

## Diffs Summary
- src/checkout/service.ts: added ...
- src/routes/checkout.ts: updated ...

## Questions / Blockers for Web Brain
- Q1: ...
- Q2: ...
```

Now you have a concrete artifact for the *next* web-brain call.

***

## 9. Loop logging

Keep a simple log file at `ai/logs/loop-log.md` that your scripts update after each full loop:

```md
# LOOP LOG

## <tag> — 2026-04-23T12:34
- Stage: handoff->plan
- Files: repo-sketch, focus-scan, handoff
- Outcome: PLAN created

## <tag> — 2026-04-23T14:02
- Stage: plan->execution
- Result: 3/5 steps succeed, tests failing
- Next: send EXECUTION REPORT to web brain
```

It’s simple, but it turns your obsession into an **auditable history** of progress instead of vibes.

***

## 10. Permanent project instructions: `agents.md`

Finally, define `ai/config/agents.md` once per repo. It’s your **AGENTS.md**:

```md
# AGENTS MANUAL

## Tech Stack
- Frontend: React + Vite (TS)
- Backend: FastAPI (pyproject.toml)
- DB: Postgres
- Message bus: NATS

## Commands
- Build: `npm run build`
- Frontend dev: `npm run dev`
- Backend dev: `uvicorn app.main:app --reload`
- Tests: `npm test`, `pytest`

## Conventions
- TypeScript strict mode, no `any`
- Backend: dependency-injected services
- No direct DB access from routes, only via services
- All new code must have tests

## Off-limits
- /infra/prod/*
- /scripts/migration/*
- Secrets files

## AI Workflow
1. Always start from repo-sketch + task-brief + focus-scan.
2. Web brain returns PLAN.
3. Agent applies PLAN and writes EXECUTION REPORT.
4. Never commit without passing tests unless explicitly allowed.
```

Context-engineering tools and guides increasingly recommend **project-level instruction files** like this so agents have stable rules and don’t have to be re-told on every prompt.[^10][^7]

***

## How this all fits together

Your full loop becomes:

1. You write `task-brief-<tag>.md`.
2. `repo-sketch.ps1` → `repo-sketch.md`.
3. `focus-scan.ps1` → `focus-scan-<tag>.md`.
4. `question-pack.ps1` → `handoff-<tag>.md`.
5. You send `handoff-<tag>.md` + web-prompt template to Gemini/Claude/ChatGPT.
6. Paste plan into `plan-<tag>.md`.
```
7. `apply-plan.ps1 -Tag <tag>` → agent executes, writes `exec-<tag>.md`.  
```

8. You review diff + exec report; if needed, send back to web brain with both **handoff + exec report** for next iteration.
9. `loop-log.md` updated every time.

Every phase produces **concrete files**. Nothing is lost. This is exactly the kind of context‑and‑artifact‑driven workflow current “effective context engineering” and repo‑map research is pushing people toward.[^8][^9][^11][^12][^7]

You can now hand this message to an agent and say:

> “Implement this arsenal in PowerShell scripts + templates for my Windows 11 projects.”

And your “web brain, agentic hands” system stops being an idea and becomes an installable toolkit.

<div align="center">⁂</div>

[^1]: https://www.mankier.com/1/fd

[^2]: https://github.com/sharkdp/fd

[^3]: https://kx.cloudingenium.com/en/erdtree-modern-tree-disk-usage-git-aware-file-hierarchy-guide/

[^4]: https://arxiv.org/html/2604.18413v2

[^5]: https://github.com/NousResearch/hermes-agent/issues/535

[^6]: https://www.harness.io/blog/your-repo-is-a-knowledge-graph-you-just-dont-query-it-yet

[^7]: https://packmind.com/context-engineering-ai-coding/best-context-engineering-tools/

[^8]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

[^9]: https://www.the-ai-corner.com/p/context-engineering-guide-2026

[^10]: https://www.augmentcode.com/guides/how-to-build-agents-md

[^11]: https://aider.chat/2023/10/22/repomap.html

[^12]: https://aider.chat/docs/repomap.html

