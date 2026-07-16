# CARD: Unknown Repo

**Formula:** recon + scope

**Tool:** Any (repo-recon.ps1 for CLI, or manual tree + git log)

**Prep (5 min):**
1. Run `recon` on the repo.
2. Paste recon output + BELT.md into agent.
3. Agent classifies: what is this, what works, what is broken.

**Agent contract:**
- Read recon output.
- Produce: PRODUCT_AUDIT.md (what works, what is broken, what is missing).
- Identify: top 3 files that matter most.
- End with: NEXT — what this repo is, what to do first.

**Acceptance:** Audit is evidence-based. Top 3 files are justified. No vibes.
