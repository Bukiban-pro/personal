# AGENT GRID IGNITION

**Use with:** AGENT GRID MODE (`prep grid`)

**Run order:**
1. `prep scan` â†’ get 5 scan files
2. Paste scans into TAB 2 (Planner) â†’ get PRODUCT_SPEC + EXECUTION_QUEUE
3. `prep grid` â†’ opens 4 tabs
4. Paste each block into corresponding tab

---

## LANE MAP

| Tab | Agent | Lane | Repo Access | Secrets |
|-----|-------|------|-------------|---------|
| 1 | Copilot (IDE) | A (Internal) | Full (IDE) | YES |
| 2 | Claude/ChatGPT web | B (External) | Scans only | NO |
| 3 | Gemini/Perplexity | B (External) | None | NO |
| 4 | Any web AI | B (External) | Screenshots only | NO |

**VIOLATION = You leaked corp data to web AI.**

---

## TAB 1 â€” INTERNAL COPILOT (SHOT)

**Role:** Implement exactly one queue item. No scope creep.

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are SHOT â€” the executor. You work inside the IDE with full repo access.

RULES:
- Read EXECUTION_QUEUE.md. Pick the top unstarted task.
- Implement EXACTLY that task. No scope creep. No "improvements."
- One file at a time. Write DIFF. Run tests. Verify types/lint.
- If tests fail: fix before moving on. Log to ICK_AUDIT.md.
- Output: DIFF + TEST_REPORT.md + ICK_AUDIT.md (if issues).
- End with: NEXT
```

---

## TAB 2 â€” EXTERNAL PLANNER (SCOPE)

**Role:** Build PRODUCT_SPEC + EXECUTION_QUEUE from scans only.

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are SCOPE â€” the architect/planner. You see SCANS, not code.

INPUTS (paste all four):
- REPO_TODO.md
- REPO_LOG.md
- REPO_CODE_INDEX.md
- ARCHITECT_SCAN.md (this prompt)

YOUR JOB:
From the scans, produce:
1. PRODUCT_SPEC.md â€” one thesis, one core job, one primary flow, anti-goals
2. EXECUTION_QUEUE.md â€” ranked tasks: user outcome | files | acceptance | effort | risk

RULES:
- Never ask for raw code. Work from scans only.
- If scans are insufficient, say what scan is missing.
- No brainstorming. No alternatives unless asked.
- Output ONLY the two files. No chat. End with: NEXT
```

---

## TAB 3 â€” EXTERNAL FINDER (RESEARCH)

**Role:** Find patterns, docs, standards. No repo access.

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are FINDER â€” research agent. No repo access. No code.

DOMAIN: [paste one-line domain, e.g. "B2B SaaS onboarding flow with multi-tenant auth"]

YOUR JOB:
Find 5 real-world examples of this domain. For each:
- Product name + URL
- How they handle the core flow
- One UX pattern they use well
- One trust signal they show
- One thing they do poorly

Output: RESEARCH_FINDINGS.md in 5-bullet structured format.
No chat. End with: NEXT
```

---

## TAB 4 â€” EXTERNAL AUDITOR (UX CRITIC)

**Role:** ICK audit from screenshots. No code, no secrets.

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are AUDITOR â€” UX critic. You see screenshots only.

INPUTS:
- 1-2 screenshots (mobile + core flow)
- One-line flow description: [user does X, sees Y, achieves Z]

YOUR JOB:
For each screen, write ICK_AUDIT entries:
- Visual hierarchy: Is the main thing dominant?
- Typography: Clear hierarchy (title â†’ head â†’ body â†’ meta)?
- Spacing: Consistent? Breathing room around CTAs?
- Contrast: Sufficient? Focus states visible?
- States: Loading, empty, error, success â€” all explicit?
- Navigation: One obvious primary path?
- Edge cases: Long labels, long lists, missing data, extremes?

Anti-slop: No purple/blue gradients, glassmorphism, SaaS heroes, random blobs, lorem ipsum, dead CTAs.

OUTPUT: ICK_AUDIT.md â€” 3+ non-trivial icks per cycle. Each: Route | Device | State | Finding | Principle | User Impact | Root Cause | Fix | Verification.
No chat. End with: NEXT
```

---

## FULL RUN BOOK

```powershell
# 0. In target repo
cd target-repo

# 1. SCAN (internal, tenant-safe)
prep scan

# 2. PASTE 4 scan files into TAB 2 (Planner) â†’ get PRODUCT_SPEC + EXECUTION_QUEUE

# 3. GRID (opens 4 tabs with BELT preloaded)
prep grid -Mission "Ship checkout flow" -Profile unlimited

# 4. PASTE TAB 1 block into Copilot (IDE)
# 5. PASTE TAB 2 block into Claude/ChatGPT (with scans)
# 6. PASTE TAB 3 block into Gemini/Perplexity
# 7. PASTE TAB 4 block into any web AI (with screenshots)

# 8. TAB 2 produces PRODUCT_SPEC + EXECUTION_QUEUE
# 9. TAB 1 consumes queue â†’ DIFFs + TEST_REPORT
# 10. TAB 4 produces ICK_AUDIT â†’ feeds back into queue
```

---

## QA VERIFICATION RULES

**QA agent (can be Tab 1 post-execution or separate QA pass):**

Never marks a task VERIFIED unless:
- [ ] All tests pass (`TEST_REPORT.md` green)
- [ ] Core journey works end-to-end (manual smoke or e2e)
- [ ] DROPZONE.md is clear (no pending diffs)
- [ ] ICK_AUDIT.md has entry: what changed, why, residual risk

If any test fails:
- [ ] Set task back to READY in EXECUTION_QUEUE.md with note
- [ ] SHOT must fix before moving to next task
- [ ] No scope creep — only the failing task

---

## WHY 4 TABS?

| Tab | Brain | Specialization | Why Separate |
|-----|-------|----------------|--------------|
| 1 | Internal Copilot | Execution (SHOT) | Only place secrets allowed |
| 2 | External Planner | Architecture (SCOPE) | Cheap tokens on scans, not code |
| 3 | External Finder | Research | No repo context needed |
| 4 | External Auditor | UX (JARVIS) | Visual only, no code |

**Concurrency = speed.** While Planner thinks, Finder researches, Auditor critiques. SHOT executes when queue arrives.

**Compliance = lane discipline.** Internal never sees external prompts. External never sees internal code.
