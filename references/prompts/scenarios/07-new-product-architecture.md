# CARD: New Product Architecture

**Formula:** core + unlimited + dev-mode + AGENTS

**Tool:** Claude (architecture) → you (decide) → ChatGPT (implementation)

**Prep (15 min):**
1. Write one-sentence product thesis.
2. Write one-sentence core job (what the user is trying to accomplish).
3. Run `recon` on any existing codebase.
4. Paste thesis + core job + BELT.md into Claude tab.

**Agent contract:**
- SCOPE: produce PRODUCT_SPEC.md with tech stack, data model, API surface, auth strategy.
- Decompose into: DB schema → API endpoints → frontend components → auth flow → deployment.
- Produce EXECUTION_QUEUE.md ordered by dependency (DB first, then API, then UI).
- Anti-goals: what are we explicitly NOT building?

**Acceptance:** Tech stack is justified. Data model covers core entities. API surface is minimal but complete. Queue is ordered by dependency.

**Rules:** One screen proves value. One flow must work. One metric proves it works. Everything else is scope creep until P0 is shipped.
