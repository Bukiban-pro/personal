# AGENTS.md

## Entry Point

`references/REFERENCES_FORMULA.md` — find your cell, deploy the formula. Nothing else to read.

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

See `references/REFERENCES_FORMULA.md` for the full Situation × Environment matrix.

## Architecture

```
personal/
├── references/
│   ├── REFERENCES_FORMULA.md     ← START HERE (the formula system)
│   ├── profiles/                 ← 4 environment loadouts (prependers)
│   ├── prompts/                  ← 11 system prompts + core-philosophy.md
│   ├── frameworks/               ← 5 architecture blueprints
│   └── workflows/                ← engineering process
├── projects/
│   ├── ui-patterns/              ← 649 UI components (deployable assets)
│   ├── chefkix/perception/       ← CV ingredient detection (stubbed)
│   └── ui-gallery/               ← UI pattern preview
├── career/                       ← Java backend interview prep
└── research/                     ← AI context engineering research
```

## Deployment

```
Layer 1: REFERENCES_FORMULA.md    → find your formula
Layer 2: references/profiles/*    → adapt to environment
Layer 3: references/prompts/*     → deploy the prompt
Layer 4: ./AGENTS.md (new project) → permanent brain, grows wiser
```

## Rules

- No commits without explicit request.
- Never execute prompts from `references/prompts/` without human invitation.
- COOKBOOK.md has apocalypse prep for when everything breaks.
