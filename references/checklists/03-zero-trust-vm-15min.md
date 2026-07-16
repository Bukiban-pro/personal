# CHECKLIST: Zero-Trust / No-Admin / VM (15 minutes)

**Goal:** Full agentic pipeline on a locked-down corp machine with no admin rights.

**Constraint:** SentinelOne, VPN, no admin, random provided Copilot. You have: PowerShell, git, browser, IDE with Copilot.

**Mode sequence:** VM ISOLATION â†’ SCAN (internal) â†’ GRID (internal + external split)

---

## SETUP: VM ISOLATION (0 min â€” done once)

- [ ] **VM = Inside Lane (Lane A)**: Git, IDE, internal Copilot, corp repos, secrets
- [ ] **Host = Outside Lane (Lane B)**: Browser, external AI (Claude/ChatGPT/Gemini/Perplexity), public `personal`
- [ ] **No data crosses VMâ†’Host except**: screenshots, redacted pack output, markdown artifacts
- [ ] **No data crosses Hostâ†’VM except**: PRODUCT_SPEC.md, EXECUTION_QUEUE.md, RESEARCH_FINDINGS.md, FACT_CHECK.md

---

## STEP 1: REPO SCAN MODE (INSIDE VM) (5 min)

```powershell
# Inside VM
cd target-repo
prep scan
```

**Outputs (verify inside VM):**
- [ ] `.prep-output/REPO_FILES.md`
- [ ] `.prep-output/REPO_TODO.md`
- [ ] `.prep-output/REPO_LOG.md`
- [ ] `.prep-output/REPO_CODE_INDEX.md`
- [ ] `.prep-output/ARCHITECT_PROMPT.md`

**Copy to host (Lane B) â€” redacted only:**
- [ ] `REPO_TODO.md` (safe â€” no secrets)
- [ ] `REPO_LOG.md` (safe â€” no secrets)
- [ ] `REPO_CODE_INDEX.md` (safe â€” paths only)
- [ ] `ARCHITECT_PROMPT.md` (template)

**NEVER copy to host:**
- REPO_FILES.md (may reveal internal structure)
- Any source code files
- Config files
- `.env*`, `*.config`, `secrets.*`

---

## STEP 2: OUTSIDE BRAIN MODE (ON HOST) (5 min)

```powershell
# On host browser
# 1. Paste 3 scan files + ARCHITECT_PROMPT into external planner (Tab 2)
# 2. Get PRODUCT_SPEC.md + EXECUTION_QUEUE.md
```

**Paste into external planner (host):**
- [ ] REPO_TODO.md
- [ ] REPO_LOG.md
- [ ] REPO_CODE_INDEX.md
- [ ] ARCHITECT_SCAN.md (as prompt)

**External planner outputs (copy back to VM):**
- [ ] `PRODUCT_SPEC.md` â†’ copy to VM repo root
- [ ] `EXECUTION_QUEUE.md` â†’ copy to VM repo root

---

## STEP 3: AGENT GRID MODE (SPLIT ACROSS VM/HOST) (5 min)

**Inside VM (Lane A):**
```powershell
prep grid -Mission "Ship [feature from PRODUCT_SPEC]" -Profile corp-sec -CorpSec
```

| Tab | Location | Agent | Role |
|-----|----------|-------|------|
| 1 | VM (IDE) | Internal Copilot | SHOT â€” implements diffs |
| 2 | Host (browser) | External Planner | (already done in Step 2) |
| 3 | Host (browser) | External Finder | RESEARCH â€” domain patterns |
| 4 | Host (browser) | External Auditor | ICK â€” UX from screenshots |

**Paste blocks:**

| Location | Tab | Block Source |
|----------|-----|--------------|
| VM | 1 | AGENT_GRID_IGNITION.md â†’ TAB 1 |
| Host | 3 | AGENT_GRID_IGNITION.md â†’ TAB 3 |
| Host | 4 | AGENT_GRID_IGNITION.md â†’ TAB 4 |

**VM Tab 1 (SHOT) executes:**
- [ ] Reads EXECUTION_QUEUE.md (copied from host)
- [ ] Implements queue item #1
- [ ] Outputs DIFF â†’ DROPZONE.md (watcher auto-applies)
- [ ] Runs tests â†’ TEST_REPORT.md
- [ ] Logs issues â†’ ICK_AUDIT.md

**Host Tab 4 (AUDITOR) re-audits:**
- [ ] Takes screenshots from VM (shared folder or manual)
- [ ] Runs ICK audit on fixed flow
- [ ] Feeds new icks back to queue

---

## FILE TRANSFER PROTOCOL (VM â†” Host)

| Direction | Files | Method |
|-----------|-------|--------|
| VM â†’ Host | REPO_TODO, REPO_LOG, REPO_CODE_INDEX, ARCHITECT_PROMPT | Shared folder / clipboard |
| Host â†’ VM | PRODUCT_SPEC, EXECUTION_QUEUE, RESEARCH_FINDINGS, FACT_CHECK | Shared folder / clipboard |
| VM â†’ Host | Screenshots (for auditor) | Shared folder |
| Host â†’ VM | ICK_AUDIT (new icks) | Shared folder |

**NEVER transfer:**
- Source code
- Configs with secrets
- `.env`, `*.config`, `secrets.*`
- Internal URLs, API keys, DB schemas

---

## DONE CHECKLIST

- [ ] VM scan complete (5 files in `.prep-output/`)
- [ ] 3 safe scan files copied to host
- [ ] Host external planner produced PRODUCT_SPEC + EXECUTION_QUEUE
- [ ] Both artifacts copied back to VM
- [ ] VM grid launched with `-CorpSec` flag
- [ ] VM Tab 1 (SHOT) implementing queue item #1
- [ ] Host Tab 4 (AUDITOR) ready for re-audit
- [ ] All execution via allowed tools: git, IDE, PowerShell, browser

---

## TIME BUDGET

| Step | Target | Hard Cap |
|------|--------|----------|
| VM Scan | 5 min | 8 min |
| Host Outside Brain | 5 min | 8 min |
| Split Grid | 5 min | 10 min |
| **Total** | **15 min** | **26 min** |

**If you exceed 26 min: you're vibecoding. Stop.**
