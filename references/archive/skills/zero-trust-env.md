# zero-trust-env

Deploy when: corp environment blocks everything. No external AI, no URL access, no copy-paste of proprietary code.

## The Two-Lane Strategy

**Lane A — Internal Truth:** real code, real logs, real bugs, real artifacts.
Approved agent only. Never leaves the fence.
Tools: GHCP Copilot Agent, VS Code Copilot, Claude Code (local), Ollama.

**Lane B — External Intelligence:** public patterns, design heuristics, prompt
frameworks, audit templates, redacted pseudo-code. Safe to paste anywhere.
Tools: ChatGPT web, Claude web, Perplexity, Gemini.

**The rule:** inside Copilot, use real enterprise context when permitted.
Outside Copilot, use only public or safely transformed context.
Never casually blend sensitive code into web-query AI.

## Safe Redaction Guidelines

| Content | Rule |
|---------|------|
| Business logic in functions | Replace with `// [BUSINESS LOGIC]` or synthetic equivalent |
| API endpoints / URLs | Replace with `https://[INTERNAL_API]/path` |
| Config values / secrets | Replace with `[REDACTED_CONFIG]` |
| DB schema / queries | Replace with `-- [SCHEMA REDACTED]` |
| Proprietary algorithms | Replace with `// See internal docs: [DOC_LINK]` |
| Comments with internal knowledge | Strip or replace with generic equivalent |
| File paths that reveal org structure | Use `./src/[MODULE]/[FILE]` |

## Approved Tool Matrix

| Tool | Safe for proprietary code? | Notes |
|------|---------------------------|-------|
| GHCP Copilot Agent (MCP) | YES | Approved integration. Can read full files. |
| VS Code Copilot inline | YES | Edits buffer, sees visible code only. |
| Claude Code (local) | YES | Local execution. Code never leaves machine. |
| Local LLM (Ollama, LM Studio) | YES | Runs locally. Code never leaves machine. |
| ChatGPT web | NO | Do not paste proprietary code. Use scrubbed snippets. |
| Claude web | NO | Do not paste proprietary code. Use scrubbed snippets. |
| OpenRouter / Groq web | NO | Zero trust these. Never paste real code. |

## First Move on Any New Machine

1. Paste BELT.md into the approved agent
2. Define the mission and role split
3. Make the agent output artifacts, not chat
4. Keep all sensitive truth in repo-local markdown under company control

## What Never to Do

- No unauthorized binaries, evasion tricks, unapproved background automation.
- No bypassing endpoint policy or application allowlisting.
- No assuming "basic Copilot" = "safe for anything."
- Need more capability? Business case for approved tool path. Not a shadow platform.

## Corp Mirror

If GitHub URLs are blocked:
```
personal/ on GitHub          → internal-git/references/ (same structure)
raw.githubusercontent.com/   → internal KB pages (render prompts as articles)
references/prompts/*         → internal wiki as "Engineering Standards"
```

All formulas from BELT.md work with local paths:
```
Instead of:   references/profiles/stealth.md
Use:          ./references/profiles/stealth.md  (local copy)
```
