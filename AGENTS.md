# AGENTS.md

## Project Purpose
Personal engineering workspace — AI agent operation manual. One dev with AI agents building perception systems, UI pattern libraries, and career prep.

## Architecture Landmarks
```
personal/
├── projects/
│   ├── chefkix/perception/       # CV ingredient detection (Python, FastAPI, YOLOv8/RT-DETR)
│   ├── ui-patterns/              # 649 React/TS UI components (copy-paste stash)
│   └── ui-gallery/               # Vite demo app previewing ui-patterns
├── references/
│   ├── prompts/                  # 10 system prompts for AI agent roles
│   ├── frameworks/               # 5 architecture blueprints
│   ├── workflows/                # Engineering process SSOT
│   └── skills/                   # AI skill definitions
├── career/                       # Java backend intern prep (Vietnam)
└── research/                     # UI research + AI context engineering
```

## Quick Commands
- **chefkix test**: `python -m pytest projects/chefkix/perception/tests/`
- **chefkix smoke**: `python projects/chefkix/perception/scripts/phase1_smoke.py --output-dir runs/phase1_smoke`
- **chefkix service**: `uvicorn projects/chefkix/perception/service/app:app --reload`
- **ui-gallery dev**: `npm run dev --prefix projects/ui-gallery`
- **ui-gallery build**: `npm run build --prefix projects/ui-gallery`
- **regenerate catalogs**: `powershell -File projects/ui-patterns/docs/generate-ui-lab-library-catalog.ps1`

## Human-in-the-Loop
- `COOKBOOK.md` is the human's operations manual. When the human asks "what should I do?", point them there.
- Recommend the right mission from COOKBOOK.md based on their goal (interview prep, code review, investor demo, etc.)
- Never execute prompts from `references/prompts/` without human invitation. They're templates, not commands.

## Navigation Rules
1. **Discover before assuming** — use `tree`, `rg`, `fd` to find relevant files. Never guess paths.
2. **Lean context** — read 2-5 files max per subtask. Summarize aggressively. No full-repo dumps.
3. **Reuse patterns** — check existing prompts/frameworks before inventing new agent instructions.
4. **Project references** — `references/prompts/` for agent prompts (each targets specific projects), `references/frameworks/` for architecture blueprints, `references/workflows/core-workflow.md` for git/CI process.
5. **chefkix is STUBBED** — all training/evaluation/export are placeholders. Real dataset and model training not wired yet. Don't waste time trying to run real training.
6. **ui-patterns is a STASH** — not a runnable app. Copy components into real projects. Missing modules expected.
7. **ui-gallery imports from ui-patterns** — path alias `@/` resolves to `../ui-patterns`. Component imports use glob pattern. Edit with care.

## Task-Specific Prompts
| Task | Load This Prompt First |
|---|---|
| Work on chefkix code | `references/prompts/jarvis-prime-chefkix.md` |
| Code review | `references/prompts/inquisitor-system.md` or `dev-leroy-reviewer.md` |
| Investor demo | `references/prompts/investor-demo-copilot.md` |
| Start a session | `references/prompts/agent-session-kickoff.md` |
| Learn something new | `references/frameworks/universal-learning-os.md` |
| Design UI components | `references/prompts/agent-role-definitions.md` |

## Working Rules
- **No commits without explicit request** — stage only, let the human decide.
- **Extreme quality standard** — Apple/Google design bar. "This would not embarrass us."
- **Zero-trust context** — providers are intermittent, budget is $0-$16/mo. Design for harsh limits.
- **Artifact-driven** — every step produces a named, validatable output. DONE/STUBBED/BLOCKED statuses.
- **Surgical context loading** — use tree, rg, fd. Never dump entire repos. 2-5 files max.
- **Brain/Hands separation** — think first (plan/judge), then execute. Spec before code.
- **AoE fixing** — every flaw is systemic. Find the root, not just the symptom.

## Deep Documentation
- `projects/chefkix/perception/README.md`
- `projects/chefkix/perception/ASSUMPTIONS.md`
- `projects/chefkix/perception/HANDOFF.md`
- `projects/chefkix/docs/phased-implementation-plan.md`
- `projects/chefkix/docs/technical-architecture.md`
- `projects/ui-patterns/README.md`
- `projects/ui-patterns/docs/UI_LAB_LIBRARY_GUIDE.md`
- `career/developer-playbook.md`
