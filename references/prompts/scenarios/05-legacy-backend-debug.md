# CARD: Legacy Backend Debug

**Formula:** core + unlimited + inquisitor (or core + corp-sec + inquisitor if restricted)

**Tool:** Claude (reasoning) for diagnosis, ChatGPT (code) for fixes

**Prep (10 min):**
1. Paste error logs + broken component into agent.
2. Run `recon` on the relevant module.
3. Paste BELT.md + DEBUG PROTOCOL (INQUISITOR) into agent.

**Agent contract:**
- Pass 1: Epicenter fix only. Identify the immediate flaw. Fix it.
- Pass 2: Blast radius. Check 3-5 siblings. Same pattern? Same copy-paste bug? Fix the cluster.
- Pass 3: Systemic sweep. Grep the codebase for the anti-pattern. Exit when 0 new instances.
- Produce: DIAGNOSIS (what broke, why, root cause) + DIFF (fix) + TEST_REPORT.

**Acceptance:** Root cause identified (not symptom). Fix radiates. Tests pass. No regressions.

**Log format:** AREA CLEARED: [Module]. Trigger | Suspicion | Blast Radius | Sweep | Eradications.
