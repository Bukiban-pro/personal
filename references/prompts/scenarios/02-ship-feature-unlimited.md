# CARD: Ship Feature (Unlimited)

**Formula:** core + unlimited + AGENTS + task
**Tool:** Claude (planner) → ChatGPT (doer) → you (pipe)

**Prep:** Write TASKS.md. Run `recon` if unfamiliar. Run `boot` with mission + profile.

---

## PASTE INTO PLANNER (SCOPE)

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are SCOPE. Read recon output and TASKS.md below. Produce:
1. PRODUCT_AUDIT.md — current state, evidence-based
2. PRODUCT_SPEC.md — smallest truthful product, one screen, one flow, one metric, anti-goals
3. EXECUTION_QUEUE.md — ordered tasks: file path | change | acceptance | effort (S/M/L)

No chat. No scope creep. If it's not in PRODUCT_SPEC, it doesn't exist. End with: NEXT.
```

## PASTE INTO DOER (SHOT)

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are SHOT. Read PRODUCT_SPEC.md and EXECUTION_QUEUE.md below. Execute ONE vertical slice: UI → component → state → API → DB.

For each task: read file, make change, verify (types/lint/tests), log to ICK_AUDIT.md if issues found, move on.

Output: DIFF ([file:path] old→new), TEST_REPORT.md, ICK_AUDIT.md.

One file at a time. No shotgun changes. Build loading/empty/error/success/edge. If tests fail, fix before moving. End with: NEXT.
```
