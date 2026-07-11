# zero-trust-env

Deploy when: corp environment blocks everything. No external AI, no URL access, no copy-paste of proprietary code.

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

## Approved Tooling Matrix

| Tool | Safe for proprietary code? | Notes |
|------|---------------------------|-------|
| GHCP Copilot Agent (MCP) | YES | Approved integration. Can read full files. |
| VS Code Copilot inline | YES | Edits buffer, sees visible code only. |
| Claude Code (local) | YES | Local execution. Code never leaves machine. |
| ChatGPT web | NO | Do not paste proprietary code. Use scrubbed snippets. |
| Claude web | NO | Do not paste proprietary code. Use scrubbed snippets. |
| OpenRouter / Groq web | NO | Zero trust these. Never paste real code. |
| Local LLM (Ollama, LM Studio) | YES | Runs locally. Code never leaves machine. |

## Corp Mirror

If GitHub URLs are blocked:
```
personal/ on GitHub          → internal-git/references/ (same structure)
raw.githubusercontent.com/   → internal KB pages (render prompts as articles)
references/prompts/*         → internal wiki as "Engineering Standards"
```

All formulas from REFERENCES_FORMULA.md work with local paths:
```
Instead of:   references/profiles/stealth.md
Use:          ./references/profiles/stealth.md  (local copy)
```
