# CHECKLIST: Vibecoded Monstrosity â€” 30 Minutes

**Scenario:** Working codebase but UX is broken, inconsistent, untrustworthy. Need: ICK audit â†’ fix one core flow.
**Modes:** SCAN (UI-focused) â†’ OUTSIDE BRAIN (UX) â†’ GRID (fix)

---

## PREP (30 seconds)
- [ ] `cd target-repo`
- [ ] Identify 1-2 core flows to audit (e.g., "signup â†’ onboarding â†’ first value")

---

## 1. REPO SCAN MODE â€” UI FOCUS (5 min)
```powershell
prep scan
```
**Then filter for UI:**
```powershell
# Find routes, components, pages
findstr /S /I "route component page screen view" .prep-output\REPO_CODE_INDEX.md
# Find state, forms, validation
findstr /S /I "form validat state hook useState useReducer" .prep-output\REPO_CODE_INDEX.md
```
**Outputs:**
- [ ] UI_FILES.txt (routes + components + forms + state)
- [ ] UI_TODOS.txt (UI-specific landmines from REPO_TODO.md)

---

## 2. CAPTURE SCREENSHOTS (5 min)
- [ ] Open app in browser
- [ ] DevTools â†’ Device toolbar â†’ Mobile (375px)
- [ ] Screenshot: entry, core action, success, error, empty states
- [ ] DevTools â†’ Device toolbar â†’ Desktop (1440px)
- [ ] Screenshot: same flows
- [ ] Save as: `flow-mobile.png`, `flow-desktop.png`
- [ ] **Verify: no secrets in screenshots** (no URLs with IDs, no real data, no internal headers)

---

## 3. OUTSIDE BRAIN MODE â€” UX AUDIT (10 min)
```powershell
# Pack UI files only for external auditor
prep outside -Mission "UX audit of [core flow]" -Profile unlimited
```
**Paste into external AI (Tab 4 Auditor):**
- [ ] Screenshots (mobile + desktop)
- [ ] One-line flow description: "User does X, sees Y, achieves Z"
- [ ] AGENT_GRID_IGNITION.md â†’ TAB 4 block

**External auditor outputs:**
- [ ] ICK_AUDIT.md â€” 3+ non-trivial icks per screen
- [ ] Prioritized by: user impact Ã-- fix effort

---

## 4. AGENT GRID MODE â€” FIX ONE FLOW (10 min)
```powershell
prep grid -Mission "Fix [top ICK from audit] in [core flow]" -Profile unlimited
```
**Tabs:**
- [ ] Tab 1 (Internal Copilot / SHOT): EXECUTION_QUEUE from ICK_AUDIT
- [ ] Tab 2 (External Planner): PRODUCT_SPEC from ICK_AUDIT (what good looks like)
- [ ] Tab 3 (External Finder): "How do best-in-class products handle [this UX pattern]?"
- [ ] Tab 4 (External Auditor): Re-audit after fix

**Execute:**
- [ ] Tab 2 produces PRODUCT_SPEC for fixed flow
- [ ] Tab 1 implements fix from queue
- [ ] Tab 3 provides pattern references
- [ ] Tab 4 verifies fix meets standards

---

## DELIVERABLES
- [ ] ICK_AUDIT.md (initial audit)
- [ ] PRODUCT_SPEC_FIXED.md (what good looks like)
- [ ] EXECUTION_QUEUE_FIX.md (tasks from audit)
- [ ] DIFF + TEST_REPORT (implemented fix)
- [ ] RESEARCH_FINDINGS.md (patterns from Finder)
- [ ] ICK_AUDIT_POST_FIX.md (verification)

---

## TIME CHECK
| Step | Target | Actual |
|------|--------|--------|
| Scan (UI) | 5 min | |
| Screenshots | 5 min | |
| Outside Brain (UX) | 10 min | |
| Grid (fix) | 10 min | |
| **Total** | **30 min** | |

---

## IF TIME EXCEEDS
- Audit > 12 min: limit to 1 screen, 3 icks max
- Fix > 12 min: scope to ONE component, not whole flow
- Grid > 12 min: drop Finder, keep SHOT + Auditor

---

## LANE CHECK
- [ ] Internal Copilot: sees real code âœ“
- [ ] External Auditor: sees screenshots only âœ“
- [ ] External Finder/Planner: no code, no secrets âœ“
- [ ] Screenshots scrubbed of secrets âœ“
