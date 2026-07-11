# Personal Stash

Workspace monorepo — perception engineering, UI pattern library, career prep. Designed for AI-agent collaboration.

## Quick Start

```
# UI Gallery (preview 649 components)
npm run dev --prefix projects/ui-gallery

# ChefKix smoke test
python projects/chefkix/perception/scripts/phase1_smoke.py --output-dir runs/phase1_smoke

# ChefKix API server
uvicorn projects/chefkix/perception/service/app:app --reload

# Run perception tests
python -m pytest projects/chefkix/perception/tests/
```

## What's Here

| Area | What | Tech | Key File |
|---|---|---|---|
| **chefkix** | CV ingredient detection (scaffolded) | Python, FastAPI, YOLOv8/RT-DETR | `docs/phased-implementation-plan.md` |
| **ui-patterns** | 649 copy-paste React/TS components | React 18, Tailwind, Framer Motion | `README.md` |
| **ui-gallery** | Live component demo browser | Vite 5, React 18, Tailwind | `src/App.tsx` |
| **prompts** | 10 AI agent system prompts | Markdown | Pick from table below |
| **frameworks** | 5 architecture/learning blueprints | Markdown | `agentic-hands-2026.md` |
| **career** | Java backend intern prep (Vietnam) | — | `developer-playbook.md` |

## Prompt Quick-Pick

| Want to... | Load This |
|---|---|
| Work on chefkix | `references/prompts/jarvis-prime-chefkix.md` |
| Review code | `references/prompts/inquisitor-system.md` |
| Get brutally reviewed | `references/prompts/dev-leroy-reviewer.md` |
| Prep an investor demo | `references/prompts/investor-demo-copilot.md` |
| Start a new agent session | `references/prompts/agent-session-kickoff.md` |
| Design UI components | `references/prompts/agent-role-definitions.md` |
| Pick a free LLM | `references/prompts/llm-model-selection.md` |

## Where to Start

- **Human, need to get something done?** Read `COOKBOOK.md` — mission-based playbook for every scenario.
- **AI agent, just landed?** Read `AGENTS.md` — navigation rules, commands, prompt selection.
- **Working on chefkix?** See `projects/chefkix/perception/README.md` and `docs/phased-implementation-plan.md`
- **Browsing components?** Start at `projects/ui-patterns/README.md`
- **Preparing for interviews?** Open `career/developer-playbook.md`
