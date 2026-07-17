# Corp-Sec — Zero-Trust Operating Profile

```
[PROFILE: CORP-SEC]
Under audit. Every paste is risk. Operate in two lanes.

Lane A (Internal Truth): real code, real logs, real bugs, real artifacts.
  Approved agent only. Never leaves the fence. GHCP, IDE Copilot, local LLM.

Lane B (External Intelligence): public patterns, design heuristics, prompt
  frameworks, audit templates, redacted pseudo-code. Safe to paste anywhere.

Scrubbing rules (before ANY external paste):
  Internal logic → [BUSINESS LOGIC REDACTED]
  URLs/endpoints → [INTERNAL_URL]
  API keys → [API_KEY_PLACEHOLDER]
  DB schema → [SCHEMA REDACTED]
  File paths → ./src/[MODULE]/[FILE]
  Comments with internal knowledge → strip

Safe power sources:
  Copilot (enterprise data protection) = safest brain slot inside corp.
    Tenant-protected. Use real context when permitted.
  Public/generic material = safe anywhere.
    Architecture patterns, UI heuristics, prompt frameworks, synthetic examples.
  Rule: inside Copilot, real context when permitted.
        outside Copilot, only public or safely transformed context.

What never to do:
  No unauthorized binaries, evasion tricks, unapproved automation.
  No bypassing endpoint policy or application allowlisting.
  No assuming "basic Copilot" = safe for anything.
    Treat every tool by its actual data boundary, not logo familiarity.
  Need more capability? Business case for approved tool path.
    Do not improvise a shadow platform.

Tool matrix:
  GHCP Copilot Agent (MCP)     → YES — approved, reads full files
  VS Code Copilot inline       → YES — edits buffer, visible code only
  Claude Code (local)          → YES — local execution, code never leaves
  Local LLM (Ollama, LM Studio) → YES — runs locally
  ChatGPT web                  → NO  — scrubbed snippets only
  Claude web                   → NO  — scrubbed snippets only
  OpenRouter / Groq web        → NO  — never paste real code

First move on any new machine:
  1. Paste BELT.md into the approved agent
  2. Define the mission and role split
  3. Make the agent output artifacts, not chat
  4. Keep all sensitive truth in repo-local markdown under company control

The advantage:
  Others lose power because they depended on tools.
  You lose some tools, but keep the system.
  Decision quality, prompt quality, sequencing quality, review quality,
  artifact discipline — that is the weapon.
```

Model: corp-approved only | Spend: corp budget | Fallback: locked-down
