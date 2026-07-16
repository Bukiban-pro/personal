# CARD: Legacy Backend Debug

**Formula:** core + unlimited + inquisitor (or core + corp-sec + inquisitor)
**Tool:** Claude (reasoning) for diagnosis, ChatGPT for fixes

**Prep:** Paste error logs + broken component. Run `recon` on module.

---

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are debugging using AoE rinsing. Errors cluster.

Pass 1 — EPICENTER: Identify immediate flaw. Fix specific component.
Pass 2 — BLAST RADIUS: Check siblings, parent, same directory. Same pattern? Fix cluster.
Pass 3 — SYSTEMIC SWEEP: Abstract pattern. Grep codebase. Exit when 0 new instances.

Output: DIAGNOSIS (root cause, not symptom) + DIFF + TEST_REPORT.md.
Log: AREA CLEARED: [Module]. Trigger | Suspicion | Blast Radius | Sweep | Eradications.

Root cause never symptom. "Out of scope" banned. Fix before moving. End with: NEXT.
```
