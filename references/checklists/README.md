# CHECKLIST INDEX â€” Prep-Time Weapons Factory

**Three fixed modes. Three scenario checklists. No thinking, just execute.**

---

## THE THREE MODES

| Mode | Command | Purpose | Lane |
|------|---------|---------|------|
| **SCAN** | `prep scan` | Repo intelligence â†’ 5 files for architect | A (internal) |
| **GRID** | `prep grid` | 4-tab agentic pipeline (SCOPE/SHOT/FINDER/AUDITOR) | A + B |
| **OUTSIDE** | `prep outside` | Pack=ultra redacted structure for external AI | B (external) |

**Run order depends on scenario.**

---

## SCENARIO CHECKLISTS

### 1. Unknown Repo â€” 15 minutes
**File:** `01-unknown-repo-15min.md`
**Sequence:** SCAN â†’ OUTSIDE â†’ GRID
**Goal:** From zero to executing queue item #1.

| Step | Command | Time |
|------|---------|------|
| 1 | `prep scan` | 5 min |
| 2 | Paste scans â†’ external planner â†’ get PRODUCT_SPEC + EXECUTION_QUEUE | 5 min |
| 3 | `prep grid` â†’ SHOT executes item #1 | 5 min |

---

### 2. Vibecoded Monstrosity â€” 30 minutes
**File:** `02-vibecoded-ux-30min.md`
**Sequence:** SCAN (UI) â†’ SCREENSHOTS â†’ OUTSIDE (UX) â†’ GRID (fix)
**Goal:** ICK audit â†’ fix one core flow.

| Step | Command | Time |
|------|---------|------|
| 1 | `prep scan` + filter for UI | 5 min |
| 2 | Capture mobile + desktop screenshots | 5 min |
| 3 | `prep outside` + screenshots â†’ ICK_AUDIT | 10 min |
| 4 | `prep grid` â†’ SHOT fixes top ick | 10 min |

---

### 3. Zero-Trust / No-Admin / VM â€” 15 minutes
**File:** `03-zero-trust-vm-15min.md`
**Sequence:** VM SCAN â†’ HOST OUTSIDE â†’ SPLIT GRID
**Goal:** Full pipeline on locked-down corp machine.

| Step | Location | Command | Time |
|------|----------|---------|------|
| 1 | VM | `prep scan` | 5 min |
| 2 | Host | Paste 3 safe scans â†’ external planner â†’ PRODUCT_SPEC + QUEUE | 5 min |
| 3 | VM + Host | `prep grid -CorpSec` (VM Tab 1 + Host Tabs 2-4) | 5 min |

---

## QUICK REFERENCE

### Mode Commands
```powershell
# Scan repo
prep scan                    # Full scan
prep scan -RepoPath ..\other # Specific repo

# Agent grid
prep grid -Mission "..." -Profile corp-sec -CorpSec

# Outside brain
prep outside -Mission "..." -Profile adaptive

# Scenario card
prep card ship-feature-unlimited -Mission "..." -Profile unlimited

# List cards
prep list
```

### Key Files (Internal Copilot / Lane A)
- WARROOM.md â€” product thesis, core job, P0s, anti-goals
- EXECUTION_QUEUE.md â€” ranked tasks with outcomes, files, acceptance
- PRODUCT_SPEC.md â€” one thesis, one flow, one metric
- ICK_AUDIT.md â€” route | device | state | finding | principle | impact | root | fix | verify
- DIFF â€” unified diff per file
- TEST_REPORT.md â€” what passed, what failed, commands to run

### Key Files (External AI / Lane B)
- REPO_TODO.md â€” landmines only
- REPO_LOG.md â€” commits only
- REPO_CODE_INDEX.md â€” paths only
- PACK=ULTRA output â€” signatures, routes, types, config keys (redacted)

### Forbidden Crossings
| From | To | Forbidden |
|------|----|-----------|
| VM (Lane A) | Host (Lane B) | Source code, configs, secrets, REPO_FILES.md |
| Host (Lane B) | VM (Lane A) | Raw code, external prompts, unredacted data |

### Allowed Crossings
| From | To | Allowed |
|------|----|---------|
| VM â†’ Host | REPO_TODO, REPO_LOG, REPO_CODE_INDEX, ARCHITECT_PROMPT, screenshots |
| Host â†’ VM | PRODUCT_SPEC, EXECUTION_QUEUE, RESEARCH_FINDINGS, FACT_CHECK, ICK_AUDIT |

---

## PROMPT TEMPLATES (references/prompts/)

| File | Used By | Purpose |
|------|---------|---------|
| ARCHITECT_SCAN.md | External Planner (Tab 2) | Scan â†’ PRODUCT_SPEC + QUEUE |
| AGENT_GRID_IGNITION.md | All 4 tabs | Hard role prompts |
| OUTSIDE_BRAIN.md | External AI (any) | Redacted structure â†’ design |
| SCOPE_SHOT_IGNITION.md | Legacy (pre-grid) | SCOPE + SHOT prompts |

---

## RULES (NON-NEGOTIABLE)

1. **No raw code to external AI.** Ever.
2. **No external prompts to internal Copilot.** Ever.
3. **Every AI interaction produces a file.** No chat-only.
4. **SCAN before GRID.** Always.
5. **One queue item at a time.** SHOT does not multitask.
6. **Time box.** If checklist exceeds hard cap â†’ scope down, don't extend.
7. **Verify after each diff.** Types, lint, tests. No exceptions.
8. **Lane discipline is the system.** Violate it, you own the leak.

---

## EVOLUTION

After 5 sessions:
- [ ] Audit PREFs in SCRATCHPAD.md
- [ ] Deduplicate
- [ ] Propose additions to BELT.md
- [ ] Update checklists if new patterns emerge
