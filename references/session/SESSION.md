# Session: 2026-07-17

**Mission**: Architect and harden the `personal` AI workflow system
**Formula**: Canonical prep path = `prep scan -> SCOPE from safe scans -> prep grid -> SHOT in repo`
**Energy**: 100%
**State**: verified

## What Was Built

| Artifact | What | Status |
|----------|------|--------|
| `BELT.md` | Demoted `recon` to legacy/deep-dive, promoted `prep` as canonical dispatcher, fixed role order and scenario flows. | done |
| `hands/prep.ps1` | Defaults to current repo, passes `-RepoPath`, `-Minimal`, and `-NoTabs` through correctly. | done |
| `hands/context-pack.ps1` | Accepts `-Mission`, writes optional output files, makes `ultra` structural instead of short-line raw code, redacts table names and secrets, handles clipboard failure honestly. | done |
| `hands/boot-session.ps1` | Aligns Tab 1 SHOT / Tab 2 SCOPE with checklists, supports current-repo session loading, and avoids false clipboard success. | done |
| `hands/run-card.ps1` | Parses CRLF one-line prep cards, executes `prep scan` / `prep grid`, and supports `-NoTabs`. | done |
| Scenario cards + formula backup | Removed stale `recon` and Tab1=SCOPE assumptions from the active cards. | done |

## Verification

- `prep list`
- `context-pack.ps1 -Pack ultra -Anonymize -NoClipboard` on `personal/payment-api/src/main/java`
- `prep outside -Mission "Smoke outside" -RepoPath personal/payment-api/src/main/java`
- `prep grid -Mission "Smoke grid" -RepoPath personal -NoTabs`
- `prep card 01-unknown-repo -RepoPath personal/payment-api -Mission "Smoke card" -NoTabs`

## Next Actions

1. Test BELT transformation in a fresh web/IDE agent.
2. Run the unknown-repo 15-minute checklist on a real repo.
3. Commit and push `personal/` after review.

---

# Session: 2026-07-16

**Mission**: Transform personal from notes repo into prep-time weapons factory
**Formula**: BELT.md = complete OS. One file. Doctrine, not notes.
**Energy**: 100%
**State**: build → verify → ship

## What Was Built

| Artifact | What | Status |
|----------|------|--------|
| BELT.md | Complete prep-time OS. Command table, 7 profiles, zero-trust constraints, pressure protocol, prep-time checklist, agent orchestration contracts, artifact contracts, debug/review/UI protocols, formula matrix, deployment modes. | ✅ |
| SCOPE_SHOT_IGNITION.md | Copy-pasteable agent contracts for SCOPE, SHOT, JARVIS. Paste into any agent. | ✅ |
| 12 scenario cards | Drop-in prompts: unknown-repo, ship-feature (unlimited/corp-sec), UX-mess, legacy-debug, PR-review, new-product, interview-prep, token-limited, zero-budget, stealth, design-critique. | ✅ |
| apply-diff.ps1 | DROPZONE watcher mode. Auto-applies .diff files from a directory. | ✅ |
| 8 scenario wrappers | .bat files: unknown-repo, ship-unlimited, ship-corpsec, ux-rescue, debug-legacy, pr-review, token-limited, watch-dropzone. | ✅ |
| CORP-SEC CONSTRAINTS | Hard rules in BELT. Forbidden/allowed/two-lanes/scrubbing. | ✅ |
| Dead weight deleted | references/archive/ (30+ files), redundant prompts (8 files), research/ (7 files). | ✅ |

## What Changed

- BELT.md rewritten as prep-time weapons factory with command table
- SCOPE_SHOT_IGNITION.md created with copy-pasteable agent contracts
- 12 scenario cards created in references/prompts/scenarios/
- apply-diff.ps1 gained DROPZONE watcher (-Watch mode)
- 8 scenario wrapper .bat files created in hands/scenarios/
- references/archive/ deleted (30+ files superseded by BELT)
- 8 redundant prompt files deleted (contracts now in BELT)
- research/ deleted (not contracts/formulas/scenarios/launchers)

## PREFs

- `[PREF: every file must earn its existence]` — Contract, formula, scenario, or launcher. Anything else dies.
- `[PREF: scenario cards beat matrix tables]` — Drop-in prompts are more useful than lookup tables under pressure.
- `[PREF: DROPZONE closes the agentic loop]` — SHOT writes diffs to a directory, apply-diff auto-applies. No clipboard friction.
- `[PREF: hard constraints beat suggestions]` — Corp-sec rules are FORBIDDEN/ALLOWED, not "consider this."

## Next Actions

1. Commit and push
2. Test: paste BELT.md into fresh agent. Verify it transforms the agent.
3. Test: run a scenario card under pressure. Verify 15-min prep works.
