# REFERENCES FORMULA — Master Deployment System (Backup)

**The system is one file: `BELT.md` at project root. Paste it. That's it.**
This file is a supplementary backup for the situation × environment matrix.
You don't need it. BELT.md contains everything inline.

## Situation × Environment Matrix

| Situation | Unlimited | Locked-Down | Zero-Budget | Token-Limited | **Adaptive** | **Stealth** | **Corp-Sec** |
|-----------|-----------|-------------|-------------|---------------|--------------|-------------|--------------|
| **Ship feature** | `core + unlimited + AGENTS + task` | `core + locked-down + AGENTS + task` | `core + zero-budget + task` | `core + token-limited + task` | `core + adaptive + AGENTS + task` | `core + stealth + local-pack + task` | `core + corp-sec + AGENTS + task` |
| **Complex feature (3+ turns)** | `jarvis + unlimited + task` | `jarvis + locked-down + task` | — | — | `jarvis + adaptive + task` | — | `jarvis + corp-sec + task` |
| **UI audit / ICK hunt** | `jarvis + unlimited` | — | — | — | — | — | — |
| **Review code** | `inquisitor` | `inquisitor` (offline) | `dev-leroy` (compressed) | `inquisitor` (grep only) | `adaptive + dev-leroy + task` | `dev-leroy` (compressed) + `local-pack` | `corp-sec + dev-leroy` |
| **Debug** | `core + unlimited + inquisitor` | `core + locked-down + problem` | `core + zero-budget + problem` | `core + token-limited + problem` | `core + adaptive + problem` | `core + stealth + problem` | `core + corp-sec + problem` |
| **Interview prep** | `learn + career` | `learn + career` (offline) | `learn + career` (compressed) | `learn + career` (cheatsheet) | `adaptive + learn + career` | `learn` (offline) + `career` (cheatsheet) | — |
| **New project** | `core + unlimited + dev-mode + AGENTS` | `core + locked-down + dev-mode + AGENTS` | `core + zero-budget + dev-mode` | `core + token-limited + AGENTS` | `core + adaptive + dev-mode + AGENTS` | `core + stealth + dev-mode` | `core + corp-sec + dev-mode + AGENTS` |
| **Investor demo** | `demo` | — | — | — | `demo` (adaptive) | — | — |
| **Design UI** | `ui-design` | — | — | — | `ui-design` (adaptive) | — | — |
| **Learn topic** | `learn` | `learn` (offline) | `learn` (3-pass) | `learn` (cheatsheet) | `adaptive + learn` | `learn` (offline) | — |
| **Build infra** | `dev-mode` | `dev-mode` (local) | — | — | `adaptive + dev-mode` | `dev-mode` (offline) | — |
| **Run multi-agent** | `protocol + web-brain` | — | — | — | `adaptive + protocol` | — | — |
| **Unknown repo** | `prep scan + ARCHITECT_SCAN` | — | — | — | `prep scan + ARCHITECT_SCAN` | — | — |
| **UI audit / ICK hunt** | `jarvis` | — | — | — | — | — | — |

## Key

```
core        = BELT.md                                   [the OS — paste the whole file]
jarvis      = references/prompts/jarvis-prime-system.md [apex OS — 14KB, use for complex 3+ turn sessions]
unlimited   = references/profiles/unlimited.md
locked-down = references/profiles/locked-down.md
zero-budget = references/profiles/zero-budget.md
token-limited = references/profiles/token-limited.md
adaptive    = references/profiles/adaptive.md          [self-detects tool capabilities]
stealth     = references/profiles/stealth.md           [no internet, corp-blocked]
corp-sec    = references/profiles/corp-sec.md          [zero-trust company compliance]
AGENTS      = references/prompts/agents-template.md    [deploy as ./AGENTS.md]
task        = your own prompt specifying what to build
problem     = paste bug report + error logs
inquisitor  = references/prompts/inquisitor-system.md
dev-leroy   = references/prompts/dev-leroy-reviewer.md
demo        = references/prompts/investor-demo-copilot.md
ui-design   = references/prompts/agent-role-definitions.md
learn       = references/frameworks/universal-learning-os.md
career      = career/developer-playbook.md
dev-mode    = references/frameworks/dev-mode-blueprint.md
protocol    = references/frameworks/dual-agent-concurrency-protocol.md
web-brain   = references/frameworks/web-brain-agentic-hands.md
local-pack  = references/skills/zero-trust-env.md     [offline survival]
session     = references/session/SESSION.md           [context persistence]
cold-start  = references/workflows/cold-start.md      [2-min re-entry]
token-pack  = references/workflows/token-packing.md   [max value per budget]
java-tasks  = references/templates/java-backend-tasks.md [Spring Boot recipes]
persona     = references/frameworks/persona-switching.md [5 operating personas]
models      = references/prompts/llm-model-selection.md  [model selection policy]
snippets    = .vscode/opencode.code-snippets             [macro: 2-keystroke formula deploy]
triad       = Finder/Planner/Doer                        [see protocol + web-brain]
```

## Deployment Order

```
0. cold-start      → run if you haven't touched the system in 7+ days
0. adaptive        → self-classify the tool (only if using adaptive profile)
0. session         → copy SESSION.md into project root, write mission line
0. energy+persona  → declare energy level (20/50/80/100%) + pick persona
1. core + profile  → prepend before task prompt (this is the OS)
2. AGENTS          → deploy as ./AGENTS.md in project root (this is the brain)
3. skillpack       → load relevant skill card (optional, for domain-specific work)
3. token-pack      → check budget, pack components if budget-limited
4. persona         → load persona rules for this task (optional, default: Builder)
5. task            → the actual prompt describing what to build
6. session         → AI updates SESSION.md in real-time during work
7. harvest         → AI writes Session Harvest on completion
```

## Tool-Agnostic Rule

If you don't know the tool's capabilities: load `adaptive` profile first. It probes the tool and switches to the right sub-mode. Never guess again.

## Verification

After any formula, check:
- [ ] Artifact exists (diff, plan, test output, etc.)
- [ ] SESSION.md state matches reality (file log, blockers, next action)
- [ ] AGENTS.md updated with lessons learned
- [ ] Prepender installed the OS (model behaves like Iron Man, not a generic assistant)

## Cell Metadata

| Situation | Environment | Est. Time | Difficulty | Driver | Artifacts |
|-----------|-------------|-----------|------------|--------|-----------|
| Ship feature | Unlimited | 30-60min | Medium | AI | PLAN, DIFF, TEST_REPORT |
| Ship feature | Locked-Down | 45-90min | Medium | AI | PLAN, DIFF, TEST_REPORT |
| Ship feature | Zero-Budget | 20-40min | Easy | Human | DIFF only |
| Ship feature | Token-Limited | 20-40min | Easy | AI (compressed) | DIFF, TEST_REPORT |
| Ship feature | Tool-Agnostic | 30-60min | Medium | AI | PLAN, DIFF, TEST_REPORT |
| Ship feature | Stealth | 45-90min | Hard | Human | DIFF only (no PLAN) |
| Review code | Unlimited | 15-30min | Easy | AI | PR-REVIEW |
| Review code | Locked-Down | 20-40min | Easy | AI | PR-REVIEW |
| Review code | Zero-Budget | 10-20min | Easy | AI | PR-REVIEW (compressed) |
| Review code | Token-Limited | 15-30min | Easy | AI | PR-REVIEW (grep-based) |
| Review code | Tool-Agnostic | 20-40min | Easy | AI | PR-REVIEW |
| Review code | Stealth | 20-40min | Medium | AI | PR-REVIEW (compressed) |
| Debug | Unlimited | 20-60min | Medium | AI | DIAGNOSIS, DIFF |
| Debug | Locked-Down | 30-60min | Medium | AI | DIAGNOSIS, DIFF |
| Debug | Zero-Budget | 15-30min | Easy | Human | DIAGNOSIS only |
| Debug | Token-Limited | 20-40min | Medium | AI (compressed) | DIAGNOSIS, DIFF |
| Debug | Tool-Agnostic | 20-60min | Medium | AI | DIAGNOSIS, DIFF |
| Debug | Stealth | 30-60min | Hard | Human | DIAGNOSIS, DIFF |
| Interview prep | Any | 30-60min | Medium | AI | Study note, quiz, schedule |
| New project | Any | 30-60min | Medium | AI | AGENTS.md, PLAN, scaffold |
| Investor demo | Unlimited | 20-40min | Medium | AI | DEMO.md, prototype |
| Design UI | Unlimited | 30-60min | Medium | AI | DESIGN-SPEC |
| Learn topic | Any | 20-40min | Easy | AI | Study note, quiz |
| Build infra | Unlimited/Locked | 45-120min | Hard | AI | PLAN, config, tests |
| Run multi-agent | Unlimited | 60-120min | Hard | AI | SCRATCHPAD, PLAN, EXECUTION_LOG |

**Driver**: who produces the primary output. AI = agent does the work, Human = human pipes in compressed prompts.
**Difficulty**: Easy (15-30min), Medium (30-60min), Hard (60-120min). Adjust for familiarity.

## Free Web Tool Allocation

| Task Type | Best Tool | Why |
|-----------|-----------|-----|
| Reasoning, architecture, planning | Claude web | Best long-context reasoning |
| Code generation, diffs, implementation | ChatGPT (4o) | Strong code output, fast |
| Research, web-grounded facts | Perplexity / Gemini | Live web access |
| Multimodal UX review | Claude or GPT-4o | Best vision + reasoning |
| Large file ingestion | Gemini (1M context) | Largest free context window |

**Rule:** Pick the tool for the task type, not your favorite tool. This is in your formula matrix.

## Boot Sequence (Apocalypse: Free Web, No API, No MCP)

```
1. Open any web tool
2. Paste: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md
   With: "Read this file and adopt the OS before we begin"
3. Task follows. Session boots in under 60 seconds.
```

For the triad: open three tabs. Git is shared memory. SESSION.md is handoff protocol.

