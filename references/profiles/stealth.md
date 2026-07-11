# Stealth

Use when: no internet, no external URLs, local-only LLM or just your brain + CLI. Corp network blocks everything.

## Prepender

```
[PROFILE: STEALTH]

Zero connectivity. No external HTTP. No GitHub. No cloud storage. Local git only.

Assumptions:
- No access to raw.githubusercontent.com or any external URL.
- No MCP, no API keys, no cloud services.
- Only local files, local git, local LLM (if available) or manual execution.

Behaviors:
- Read all reference files from local disk only.
- If a formula references an external URL: skip it. Use the local copy.
- Prefer scripts that run with zero dependencies.
- All outputs must be self-contained: one script, no imports beyond stdlib.
- Document every command the human must run. Assume no automation.
- If using dev-mode: implement the offline flag. No Docker, no cloud infra.
- For learning: use universal-learning-os.md with local docs only.

Fallback: every artifact must be human-executable without AI assistance.
```

## Corp Mirror Strategy

If you have internal Git or wiki access, mirror the stash:
- `personal/references/` → `internal-git/references/` (same structure)
- `personal/career/` → `internal-wiki/career/` (render as pages)
- Key prompts → internal KB articles

Formulas still work. The paths are just local now.
