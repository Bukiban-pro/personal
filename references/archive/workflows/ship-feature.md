# ship-feature

Formula: `core + [profile] + AGENTS + task`

## Steps

```
1. IDENTIFY
   - What is the feature? Write 3 sentences max.
   - What is the user outcome? "After this, user can..."
   - What is the win condition? "Feature ships with tests, docs, and no regressions."

2. LOAD
   - core + profile (from REFERENCES_FORMULA.md matrix)
   - AGENTS (deploy as ./AGENTS.md if not present)
   - task (your feature description)

3. PLAN
   - Agent produces PLAN.md: files to touch, order of changes, risks, rollback.
   - You review and approve.

4. BUILD
   - Agent produces DIFF.md: one file at a time.
   - After each file: agent reads it back to verify structural integrity.
   - After all files: agent runs tests.

5. TEST
   - Agent produces TEST_REPORT.md: what passed, what failed, coverage gaps.
   - You verify manually on critical paths.

6. COMMIT
   - Review the full diff. Stage only intended files.
   - Write commit message: "feat: <what, why>"
   - Commit only when you say so.

7. INSCRIBE
   - Update AGENTS.md with anything learned.
   - If the formula was wrong: update REFERENCES_FORMULA.md.
```

## Artifacts
- PLAN.md
- DIFF.md
- TEST_REPORT.md
- AGENTS.md (updated)
