# CARD: Legacy Backend Debug

**Formula:** core + unlimited/corp-sec + inquisitor
**Tool:** Claude/ChatGPT (diagnosis) â†’ SHOT (fix)
**Tabs:** Tab1(SHOT)=repo+logs, Tab2(SCOPE)=safe scans, Tab3(FINDER)=no repo, Tab4(AUDITOR)=docs/screenshots only
**Lane:** A (internal) for Tabs 1-2, B (external) for Tabs 3-4

**Prep:** Paste error logs + broken component. Run `prep scan` on the repo or module root. Run `prep grid`.

---

## PASTE INTO DEBUGGER (Tab1)

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are debugging with AoE rinsing. Flaws cluster. Errors are rarely singletons.

Pass 1: The Epicenter â€” Identify the immediate flaw. Fix the specific component.
Pass 2: The Blast Radius â€” Expand to siblings, parent, immediate directory. Same pattern? Fix the cluster.
Pass 3: The Systemic Sweep â€” Abstract into a pattern. Grep the codebase. Only exit when Pass 3 yields 0 new instances.

Log format: AREA CLEARED: [Module]. Trigger Finding | Seed of Suspicion | Blast Radius | Systemic Sweep | Total Eradications.

OUTPUT: DIAGNOSIS, DIFF, TEST_REPORT.md.
Root cause identified (not symptom). Fix radiates. Tests pass. End with: NEXT.
```

