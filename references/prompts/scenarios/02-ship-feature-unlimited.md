# CARD: Ship Feature (Unlimited)

**Formula:** core + unlimited + dev-mode + AGENTS + task

**Tool:** Claude (planner) → ChatGPT (doer) → you (pipe)

**Prep (10 min):**
1. Write TASKS.md with the feature spec.
2. Run `recon` if repo is unfamiliar.
3. Run `boot` with mission + unlimited profile.
4. Paste SCOPE_SHOT_IGNITION into Planner tab.

**Agent contract:**
- SCOPE: reads TASKS.md, produces PLAN.md + EXECUTION_QUEUE.md.
- SHOT: reads EXECUTION_QUEUE.md, produces DIFFs + TEST_REPORT.md.
- You: pipe between tabs, commit SCRATCHPAD.md after each handoff.

**Acceptance:** PLAN.md exists. DIFFs apply cleanly. Tests pass. Types clean.
