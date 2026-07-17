# Tool Abstraction Layer

Three tool classes. One formula system. Same output regardless of what tool they give you.

## Class A: Agentic IDE

**Examples:** GHCP Copilot Agent, Claude Code, Cursor Agent, Amazon Q Developer.
**Capabilities:** Read/write files, run terminal commands, execute tests, inspect project structure.
**Risk:** Can modify files. Can run destructive commands. Full system access.

### Input Contract
```
- Repo path or clone URL
- Task description (from REFERENCES_FORMULA.md)
- Profile (unlimited/locked/zero/token/stealth)
- AGENTS.md (if available)
```

### Expected Outputs
```
PLAN.md         — steps, risks, design decisions, file list
DIFF.md         — unified diff format, one file section at a time
TEST_REPORT.md  — what was run, what passed/failed, coverage gaps
COMMANDS.md     — any manual commands human still needs to run
```

### Safety Rules
- Read AGENTS.md before modifying any file.
- Do not touch deployment configs, secrets files, or CI/CD unless explicitly asked.
- After every write, re-read the file to verify structural integrity.
- Run tests after every significant change.

### Instructions for the Agent
```
"You are Class A: Agentic IDE. Implement the full dev-mode-blueprint.
Produce: PLAN.md → DIFF.md → TEST_REPORT.md → COMMANDS.md.
You have full file system access. Use it. Do not stop at suggestions."
```

---

## Class B: Inline Assistant

**Examples:** VS Code Copilot inline, JetBrains LLM, GHCP inline completions.
**Capabilities:** Read visible file, suggest edits in buffer. Cannot run commands or read unrelated files.
**Risk:** Low. Only sees current file context.

### Input Contract
```
- Current file content + cursor position (implicit)
- Task description (in comment or chat)
- Reference to AGENTS.md or relevant prompt (paste as context)
```

### Expected Outputs
```
- Inline diff suggestions (the agent edits the buffer directly)
- For multi-file changes: numbered list of files to edit, what to change in each
```

### Safety Rules
- Only edit the file currently open. Do not hallucinate other file contents.
- If a change requires cross-file coordination, list the files and describe the change — don't silently assume.
- Never delete code you don't understand. Prefer additive changes.

### Instructions for the Agent
```
"You are Class B: Inline Assistant. Output unified diffs only.
I will run tests. Suggest changes one file at a time.
If cross-file changes needed, list them explicitly."
```

---

## Class C: Chat Strategist

**Examples:** ChatGPT web, Claude web, Microsoft Copilot, Groq chat, any web-based AI.
**Capabilities:** Text input/output only. Cannot read files, run code, or access the repo.
**Risk:** None operationally. But high IP risk: do NOT paste proprietary code.

### Input Contract
```
- Task description (must include key context — the tool has no file access)
- Redacted snippets (if code context needed, use zero-trust-env.md guidelines)
- Profile constraints (token limit, provider, etc.)
```

### Expected Outputs
```
- Ready-to-apply patches as markdown code blocks (human copies and applies)
- Test plans as numbered steps (human executes)
- Architecture decisions with rationale and trade-offs
- Research findings with source links
- Everything must be immediately actionable by a human with no AI assistance
```

### Safety Rules
- No proprietary code in prompts. Use scrubbed/synthetic snippets only.
- Output format must be copy-paste ready: no extra commentary around code blocks.
- Always include the exact commands the human needs to run.

### Instructions for the Agent
```
"You are Class C: Chat Strategist. You have no file access, no code execution.
Output ready-to-apply patches, test plans, and architecture decisions.
Human will do all execution. Make every instruction precise and copy-paste ready.
Assume I have: [list tools available — git, node, python, etc.]"
```

---

## Tool Switching Decision Tree

```
Is the tool's capability known?
  YES → apply Class A/B/C directly.
  NO  → load adaptive profile. It probes:
         "Can you run commands?"  → Class A
         "Can you read files?"    → Class B
         "Text only?"             → Class C

Is the environment zero-trust / corp-sec?
  → Always use Class C for external AI tools (web chat).
  → Always use Class A only if approved tool (GHCP MCP, local Claude Code).
  → Never paste proprietary code into Class C external tools.
```

## Why This Beats Colleagues

They use the same tool differently every time. You have a formal contract for what the tool produces regardless of what tool it is. Same input, same output, different capability level. You get full value from whatever they give you.
