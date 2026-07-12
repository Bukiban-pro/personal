# review-pr

Formula: `[inquisitor | dev-leroy] + [profile] + task`

## Steps

```
1. SELECT STYLE
   - Systematic: inquisitor-system.md (thorough, 3-pass rinsing)
   - Brutal: dev-leroy-reviewer.md (critical PRs, need to look mean)
   - Both: inquisitor finds patterns, dev-leroy eviscerates them

2. LOAD
   - profile (from REFERENCES_FORMULA.md matrix)
   - prompt (inquisitor, dev-leroy, or both)
   - task: paste PR description + diff

3. AUDIT
   - Checklist:
     - Correctness: does it do what it says?
     - Invariants: does it break existing contracts?
     - State: loading/empty/error handled?
     - Security: inputs sanitized, auth in place?
     - Performance: N+1, unnecessary re-renders?
     - Tests: edge cases covered? Negative paths tested?

4. REPORT
   - Per-checklist-item: pass/fail with evidence.
   - Root cause analysis for each failure: "This pattern is wrong because..."
   - Blocking vs non-blocking classification.

5. RECOMMEND
   - For each blocking issue: concrete alternative.
   - For each non-blocking: suggestion only, no demand.

6. INSCRIBE
   - Add any recurring patterns to references/skills/pr-review.md.
```

## Artifacts
- PR-REVIEW-<number>.md (per-item verdict, blocking list, recommendations)
