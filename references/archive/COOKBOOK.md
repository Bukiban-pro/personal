# COOKBOOK — Survival Manual (Backup)

**The system is one file: `references/prompts/core-philosophy.md`. Paste it. Open this file for apocalypse recovery only.**

## Apocalypse Prep — When Everything Fails

| Failure Mode | Play |
|-------------|------|
| **AI provider down (all of them)** | You still have 649 UI components, dev-mode blueprint, and your brain. Open `research/`. Manual mode. You're still 10x, just slower. |
| **Credits exhausted mid-sprint** | Switch to zero-budget profile. Free web tools (ChatGPT, Gemini, Claude web). Use the raw GitHub URL boot instead of file access. |
| **Corporate IT locked everything** | `stealth` profile. Offline-first. Local LLM if available (Ollama + Mistral/Phi-3). Same boot sequence, local execution. Corp mirror: stash `personal/` in internal git. |
| **No internet (plane, dead zone)** | `stealth` profile. Local files only. Self-contained scripts. The formula still works. |
| **You're sick / 20% capacity** | Declare ENERGY: 20%. AI does one-file changes. You approve or reject. System works without the pilot at full capacity. |
| **Senior engineer hostile to your methods** | Inquisitor + Dev-Leroy. Systemic analysis + brutal clarity. They can't argue with root cause evidence and concrete alternatives. |
| **Multi-tab context loss** | SESSION.md is your cross-tab memory. End Tab 1 → commit SCRATCHPAD. Start Tab 2 → boot core + paste SESSION.md. Zero information loss. |

## Anti-Fragile Recovery Protocols

### PREEMPTION (context reset mid-task)
```
SYMPTOM: AI forgets everything. Task state lost.
RECOVERY:
1. Read SESSION.md from project root.
2. /task opencode "Resume from SESSION.md. State was: <paste State section>"
3. AI re-reads last file state, confirms nothing corrupted, continues.
PREVENTION: AI writes SESSION.md after every meaningful action. Never let state live only in context.
```

### Context Overflow (token limit reached)
```
SYMPTOM: AI loses early context, starts contradicting itself.
RECOVERY:
1. /task opencode "Context overflow. Here's the current file state: <paste>. Continue from: <next step>"
2. Reference SESSION.md for decisions and blockers.
3. Drop all optional analysis. Focus on the one next concrete action.
PREVENTION: Token-limited profile. Compress outputs. Ship completed files to disk early.
```

### AI Produces Garbage (hallucination, broken code, wrong approach)
```
SYMPTOM: Code doesn't compile. Logic is wrong. AI is confidently incorrect.
RECOVERY:
1. State exactly what's wrong. "This logic is wrong because <reason>." Correction becomes preference.
2. AI rewinds to last known-good state. Retries with new approach.
3. If AI insists: switch to Builder persona (direct instruction, no debate).
PREVENTION: AI self-critiques every output. If confidence < 70%, flags it. Human verifies critical paths.
```

### Git State Tangled
```
SYMPTOM: Merge conflicts, wrong branch, staged wrong files.
RECOVERY:
1. git stash — save everything.
2. git log --oneline -5 — understand where you are.
3. Tell AI the desired state. "I want to be on <branch> with only <files> changed."
4. AI produces exact git commands. No guesswork.
PREVENTION: AI never runs git commit. Only stages files you explicitly approve.
```

### Persona Mismatch (AI is giving wrong energy)
```
SYMPTOM: AI is verbose when you need speed. AI is brief when you need depth.
RECOVERY:
1. State your energy level: "I'm at 20%, give me the one thing."
2. State persona: "Switch to Surgeon. We're debugging."
3. AI adapts immediately. Previous interaction style is forgotten.
PREVENTION: Session starts with energy level + persona declaration.
```

### Critical Reference File Missing
```
SYMPTOM: The file REFERENCES_FORMULA.md or core-philosophy.md says "not found".
RECOVERY:
1. Paste core-philosophy.md from memory — it contains all boot rules in ~300 tokens.
2. It contains all essential operating rules. Works standalone.
3. Rebuild lost files from git: git checkout -- references/prompts/core-philosophy.md
4. If git is also gone: the references are in raw.githubusercontent.com. Fetch them.
PREVENTION: Keep a local git clone + read-only backup on USB. Mirror to internal corp git.
```

## Apocalypse Prep — Quick Reference

| Failure Mode | First Action |
|-------------|-------------|
| AI provider down | `research/` + manual mode |
| Credits exhausted | Zero-budget profile + free web tools |
| Corp IT locked everything | Stealth profile + local LLM |
| Git history corrupted | SESSION.md + staged files = evidence trail |
| You're sick / 20% | Declare ENERGY: 20%. AI adapts. |
| Senior engineer hostile | Inquisitor + Dev-Leroy. They can't argue with evidence. |
| Multi-tab context loss | SESSION.md handoff between tabs |

## If the Formula Is Not Enough

- **Need a prompt you haven't deployed before?** `references/prompts/` — each is a deployable formula.
- **Need a framework?** `references/frameworks/` — blueprints, not philosophy.
- **Need components?** `projects/ui-patterns/` — 649 deployable UI assets.
- **Need free models?** `references/prompts/llm-model-selection.md`.
- **Need to start from zero?** Paste `references/prompts/core-philosophy.md` — it's a bootable OS with profile selection built in.

## The Core Loop

When in doubt:
1. Paste `references/prompts/core-philosophy.md`. It contains the boot OS.
2. Do the thing.
