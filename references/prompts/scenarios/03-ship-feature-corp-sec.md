# CARD: Ship Feature (Corp-Sec)

**Formula:** core + corp-sec + dev-mode + AGENTS + task

**Tool:** Tenant-protected Copilot (primary) | public web AI with redacted prompts (secondary)

**Prep (10 min):**
1. Run `recon` on the repo (read-only).
2. Write WARROOM.md in target repo: product thesis, core job, P0s, anti-goals.
3. Run `boot` with mission + corp-sec profile.
4. Paste SCOPE_SHOT_IGNITION into Copilot.

**Agent contract:**
- All real code stays inside the fence (Copilot, IDE, local).
- External web AI only with redacted, synthetic, or generic prompts.
- SCOPE: produces PRODUCT_AUDIT, PRODUCT_SPEC, EXECUTION_QUEUE.
- SHOT: executes ONE vertical slice. Full chain. Diff-first.

**Acceptance:** No proprietary code leaked to external tools. Artifacts exist. Tests pass.

**Corp-sec rules (hard):**
- Never paste proprietary full-files into public web AIs.
- Scrub: [BUSINESS LOGIC REDACTED], [INTERNAL_URL], [API_KEY_PLACEHOLDER].
- Lane A for real code. Lane B for research/patterns only.
