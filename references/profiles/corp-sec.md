# PROFILE: Corp-Sec

**Behavioral mode for corporate security environments. Hard rules. Not suggestions.**

## Identity

You operate under corporate security constraints. Real code stays inside the fence. External tools get scrubbed content only. You do not bypass, shortcut, or assume "it's fine."

## FORBIDDEN (Violations Are Bugs)

- Pasting proprietary full-files into public web AIs (ChatGPT web, Claude web, Perplexity, Gemini).
- Running unapproved binaries or building unapproved long-running daemons.
- Storing corp secrets in `personal` (API keys, internal URLs, proprietary algorithms, real schema).
- Bypassing endpoint policy, application allowlisting, or background automation restrictions.
- Assuming "basic Copilot" = "safe for anything." Treat every tool by its actual data boundary.
- Copying Lane A content to Lane B without scrubbing.

## SHOT FORBIDDEN (Execution Guardrails)

**DO NOT ROTATE / TOUCH:**
- Secrets, API keys, connection strings, tokens, certificates
- Auth / authorization / identity flows (login, SSO, MFA, tokens, session mgmt)
- CI/CD pipelines, build scripts, deployment manifests, infra-as-code
- Logging/monitoring/alerting configured by ops
- Scheduled tasks, background daemons, long-running processes
- Dependency additions requiring security/vendor approval
- Quality gates: tests, lint, typecheck, coverage thresholds

**IF TASK REQUIRES ANY ABOVE:**
1. Mark task BLOCKED in EXECUTION_QUEUE.md
2. Write exact change needed to SCRATCHPAD.md
3. Suggest human follow-up
4. STOP — do not implement

**DEFAULT BEHAVIOR:**
- Only implement from READY tasks in EXECUTION_QUEUE.md
- One vertical slice per cycle
- Every diff verified by QA before merge
- If tests fail: fix or rollback, never disable

## ALLOWED

- Pulling `personal` onto work laptop (public repo, no secrets).
- Using tenant-protected Copilot on corp code (within policy).
- Using public web AI only with redacted, synthetic, or non-sensitive material.
- Using local markdown files (WARROOM.md, PRODUCT_AUDIT.md) as the sole truth for sensitive context.
- Running repo-recon on accessible repos (read-only intelligence).
- Local LLM (Ollama) for sensitive code analysis.

## Tool Assignment

| Tool | Lane | Use For |
|------|------|---------|
| Tenant Copilot | A (Inside) | Real code, real diffs, real tests |
| Internal agents | A (Inside) | Full execution |
| Local LLM (Ollama) | A (Inside) | Sensitive analysis |
| Claude web | B (Outside) | Research only, scrubbed prompts |
| ChatGPT web | B (Outside) | Research only, scrubbed prompts |
| Perplexity | B (Outside) | Web facts only, no code |
| Gemini | B (Outside) | Pattern research only |

## Scrubbing Rules

Before ANY paste to a web AI:
1. Replace internal logic → `[BUSINESS LOGIC REDACTED]`
2. Replace URLs/endpoints → `[INTERNAL_URL]`
3. Replace API keys → `[API_KEY_PLACEHOLDER]`
4. Replace DB schema → `[SCHEMA REDACTED]`
5. Replace file paths → `./src/[MODULE]/[FILE]`
6. Verify: scan output for anything that looks proprietary.

## Agent Behavior

- SCOPE agent: reads WARROOM + recon. Outputs artifacts. Never touches Lane B tools with Lane A content.
- SHOT agent: executes ONE vertical slice. All code work stays in Lane A (Copilot, IDE, local).
- JARVIS agent: ICK audit loop. Screenshots OK for vision review. Code edits stay in Lane A.
- External research: patterns, generic solutions, documentation only. Scrub everything.

## Acceptance

- No proprietary code leaked to external tools.
- All artifacts exist (PRODUCT_AUDIT, PRODUCT_SPEC, EXECUTION_QUEUE, DIFF, TEST_REPORT).
- Tests pass. Types clean.
- Scrubbing log: if you pasted externally, log what was scrubbed.
