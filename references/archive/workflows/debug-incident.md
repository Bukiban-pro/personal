# debug-incident

Formula: `core + [profile] + inquisitor + problem`

## Steps

```
1. COLLECT EVIDENCE
   - Paste error logs, stack traces, reproduction steps.
   - What changed before this broke? (deploy, config change, branch switch)
   - What's the impact? (who's blocked, how urgent)

2. LOAD
   - core + profile (from REFERENCES_FORMULA.md matrix)
   - inquisitor (for systematic root cause analysis)
   - problem (paste the evidence)

3. HYPOTHESIZE
   - Inquisitor identifies 3 likely root causes, ranked.
   - For each: "If true, what evidence would we see?"
   - You eliminate hypotheses you can disprove.

4. VERIFY
   - For remaining hypothesis: agent produces a minimal diagnostic script.
   - Run it. Does the evidence match?
   - If yes: proceed to fix. If no: loop back to hypothesize.

5. FIX
   - Agent produces DIFF.md with the fix.
   - Principle: fix root cause, not symptom. Check adjacent code for same pattern.

6. VERIFY FIX
   - Fix applied. Tests pass. Edge cases checked. Regression verified.
   - "Does this introduce new problems?"

7. INSCRIBE
   - Add the bug pattern to AGENTS.md gotchas.
   - If diagnostic technique worked well: add to inquisitor or the relevant skill pack.
```

## Artifacts
- DIAGNOSIS.md (hypotheses, eliminated paths, root cause evidence)
- DIFF.md
- AGENTS.md (updated with gotcha)
