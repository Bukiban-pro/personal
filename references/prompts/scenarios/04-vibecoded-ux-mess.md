# CARD: Vibecoded UX Mess

**Formula:** jarvis + unlimited (or jarvis + corp-sec if restricted)

**Tool:** Claude or GPT-4o (vision + reasoning) for screenshot review

**Prep (15 min):**
1. List visual output directories (tests/visual/, screenshots/, etc.).
2. Pick 1-2 screenshots: mobile, core flow (dashboard, onboarding, purchase).
3. Paste screenshots + BELT.md + JARVIS IGNITION into agent.

**Agent contract:**
- JARVIS loop: SELECT → CRITIQUE → DECOMPOSE → PLAN → EXECUTE → VERIFY → SELF-CRITIQUE → LOG → REPEAT.
- One cycle per 1-2 screenshots. Drop after critique.
- Produce: ICK_AUDIT.md with 3+ real findings per cycle.
- Each ICK: route, device, state, finding, principle violated, user impact, root cause, fix, verification.

**Acceptance:** 3+ real icks per cycle. No false alarms. Visual runner passes for affected routes.

**Anti-slop:** No purple/blue gradients, glassmorphism, SaaS hero layouts, random blobs, lorem ipsum.
