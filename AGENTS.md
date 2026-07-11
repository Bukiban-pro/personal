# AGENTS.md

## Entry Point

**The entire system is one file: `references/prompts/core-philosophy.md` (~400 tokens).**
Paste it before any task. It contains the OS, all 7 profiles inline, tool classification,
artifact contracts, and a self-evolution protocol. Nothing else is required to paste.

This repo is a reference library for when you need deep knowledge — not a deployment checklist.

## Quick Reference

| Situation | Formula |
|-----------|---------|
| Ship feature | `core + profile + AGENTS + task` |
| Review code | `inquisitor` or `dev-leroy` |
| Debug | `core + profile + inquisitor + problem` |
| Interview prep | `learn + career` |
| New project | `core + profile + dev-mode + AGENTS` |
| Investor demo | `demo` (unlimited only) |
| Design UI | `ui-design` |
| Learn topic | `learn` |
| Build infra | `dev-mode` |
| Run multi-agent | `protocol + web-brain` |
| Cold start | `cold-start` playbook |
| Token budget | `token-pack` playbook |
| Persona | `persona` framework (Teacher/Builder/Surgeon/Warrior/Explorer) |
| Energy level | `core-philosophy.md` (declare at session start: 20/50/80/100%) |
| Slash commands | `/ship`, `/debug`, `/review`, `/learn` (defined in core-philosophy.md) |

## MEM-Level Macros

2-keystroke formula deployment via VS Code snippets (`.vscode/opencode.code-snippets`):

| Keystroke | Expands to |
|-----------|-----------|
| `boot` + Tab | core + profile + task (universal OS boot) |
| `ship` + Tab | core + profile + AGENTS + task |
| `debug` + Tab | core + profile + inquisitor + problem |
| `review` + Tab | dev-leroy + diff |
| `learn` + Tab | learn + topic |
| `newproj` + Tab | core + profile + dev-mode + AGENTS |
| `design` + Tab | ui-design + task |
| `cold` + Tab | cold start ritual (2-min re-entry) |
| `session` + Tab | SESSION.md template |
| `triad` + Tab | Finder/Planner/Doer multi-agent setup |

Usage: open VS Code, type prefix, press Tab. Snippet pastes into any chat/editor.

See `references/REFERENCES_FORMULA.md` for the full Situation × Environment matrix.

## Architecture

```
personal/
├── references/
│   ├── REFERENCES_FORMULA.md     ← START HERE (the formula system)
│   ├── profiles/                 ← 7 environment loadouts (prependers)
│   ├── prompts/                  ← 9 system prompts + core-philosophy.md
│   ├── frameworks/               ← 7 architecture blueprints
│   ├── skills/                   ← 6 skill cards
│   ├── workflows/                ← 8 playbooks
│   ├── templates/                ← backend task formulas
│   └── session/                  ← context persistence (survives resets)
├── projects/
│   ├── ui-patterns/              ← 649 UI components (deployable assets)
│   ├── chefkix/perception/       ← CV ingredient detection (stubbed)
│   └── ui-gallery/               ← UI pattern preview
├── career/                       ← Java backend interview prep
└── research/                     ← AI context engineering research
```

## Deployment

```
Layer 0: cold-start / SESSION.md → resume or re-enter
Layer 1: REFERENCES_FORMULA.md    → find your formula
Layer 2: references/profiles/*    → adapt to environment
Layer 3: references/prompts/*     → deploy the prompt
Layer 4: ./AGENTS.md (new project) → permanent brain, grows wiser
```

## Cold Start

If you haven't touched the system in 7+ days: run `cold-start` playbook (`references/workflows/cold-start.md`).
Target: re-enter in under 2 minutes.

## Rules

- No commits without explicit request.
- Never execute prompts from `references/prompts/` without human invitation.
- COOKBOOK.md has apocalypse prep for when everything breaks.

## Evolution Ritual

This system hardens with every session. It's not a library — it's a weapon that sharpens itself.

### Every Session
Append a SESSION LOG entry:
```
## 2026-07-11 — <mission>
- Formula: core + <profile> + <task>
- Tool: <Class A/B/C>
- Outcome: <shipped/reviewed/learned/failed>
- What sucked: <one thing>
- Fix: <update made to AGENTS.md or formula>
```

### Weekly
- Scan `REFERENCES_FORMULA.md` for missing situation/env combos. Add them.
- Check profiles: any new corporate restrictions? New tools?
- Kill dead weight: delete files you haven't touched in a month.

### Monthly
- Refactor `frameworks/` and `skills/` based on usage data.
- Is `plan-phaseone-perception.md` still relevant? Archive if not.
- Any new skills emerged? Package them.
- Run `git log --oneline -30` and ask: "Is this making me faster or just busier?"

## GitHub as Brain API

All core prompts are plain markdown files, pasteable from raw.githubusercontent.com:
```
https://raw.githubusercontent.com/<user>/personal/main/references/prompts/core-philosophy.md
```

For corp environments that block external URLs: mirror `personal/` into internal git or wiki.
Same structure. Same filenames. Same formulas. Zero external dependency.
