# CARD: Aggressive PR Review

**Formula:** inquisitor (or dev-leroy if token-limited)

**Tool:** Claude (reasoning) for deep review, ChatGPT for quick scan

**Prep (5 min):**
1. Paste PR diff or file list into agent.
2. Paste BELT.md + REVIEW PROTOCOL (DEV-LEROY) into agent.

**Agent contract:**
- Per-file: Correctness | Invariants | State (loading/empty/error) | Security | Performance.
- Verdict per item: blocking or non-blocking.
- Each blocking: concrete alternative. "This is wrong because <evidence>. Replace with <code>."
- No "consider this." Only actionable verdicts.

**Acceptance:** Every blocking item has a concrete fix. No vague feedback. Review is complete.

**Output:** PR-REVIEW.md with per-file verdicts and concrete alternatives.
