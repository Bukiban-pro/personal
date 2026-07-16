# CHECKLIST: Unknown Repo â€” 15 Minutes

**Scenario:** New repo, no context. Need: product thesis, core flows, execution queue.
**Modes:** SCAN â†’ OUTSIDE BRAIN â†’ GRID

---

## PREP (30 seconds)
- [ ] `cd target-repo`
- [ ] Verify git repo: `git status`

---

## 1. REPO SCAN MODE (5 min)
```powershell
prep scan
```
**Outputs to `.prep-output/`:**
- [ ] REPO_FILES.md
- [ ] REPO_TODO.md (landmines)
- [ ] REPO_LOG.md (20 commits)
- [ ] REPO_CODE_INDEX.md (categorized)
- [ ] ARCHITECT_PROMPT.md

---

## 2. OUTSIDE BRAIN MODE (5 min)
- [ ] Copy 4 scan files to external AI (Claude/ChatGPT)
- [ ] Paste ARCHITECT_PROMPT.md as the prompt
- [ ] External AI outputs:
  - [ ] 10 files to inspect
  - [ ] 5 highest-risk areas
  - [ ] 3 candidate core flows
  - [ ] 1 product hypothesis (1 sentence)
  - [ ] EXECUTION_QUEUE.md (ranked tasks)

---

## 3. AGENT GRID MODE (5 min)
```powershell
prep grid -Mission "Understand and ship first fix" -Profile adaptive
```
**Tabs open:**
- [ ] Tab 1: Internal Copilot (SHOT) â€” gets EXECUTION_QUEUE
- [ ] Tab 2: External Planner â€” already done (scans â†’ queue)
- [ ] Tab 3: External Finder â€” "How do good products in this domain handle [core flow]?"
- [ ] Tab 4: External Auditor â€” screenshots of current flow (if UI)

**Execute:**
- [ ] Tab 1 implements queue item #1
- [ ] Tab 3 researches patterns for core flow
- [ ] Tab 4 audits current UX if applicable

---

## DELIVERABLES
- [ ] PRODUCT_HYPOTHESIS.md (from external planner)
- [ ] EXECUTION_QUEUE.md (from external planner)
- [ ] DIFF + TEST_REPORT (from internal Copilot on item #1)
- [ ] RESEARCH_FINDINGS.md (from Finder)
- [ ] ICK_AUDIT.md (from Auditor, if UI)

---

## TIME CHECK
| Step | Target | Actual |
|------|--------|--------|
| Scan | 5 min | |
| Outside Brain | 5 min | |
| Grid | 5 min | |
| **Total** | **15 min** | |

---

## IF TIME EXCEEDS
- Scan > 6 min: run `prep scan` with `-Minimal` (skip TODO scan)
- Outside Brain > 6 min: use `prep outside` for Pack=ultra only
- Grid > 6 min: skip Finder/Auditor, just SHOT

---

## LANE CHECK
- [ ] Internal Copilot: sees real code âœ“
- [ ] External agents: see scans only âœ“
- [ ] No secrets in scan files âœ“
- [ ] No raw code pasted to web âœ“
