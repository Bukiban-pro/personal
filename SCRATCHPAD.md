# SCRATCHPAD — Shared Memory

## Current Mission
personal is a universal prep-time OS plus cold-storage archive. Hot path boots fast; archive preserves unique AI-use artifacts until distilled.

## Completed
- [x] BELT.md: complete OS with command table, pressure protocol, prep-time checklist
- [x] SCOPE_SHOT_IGNITION.md: copy-pasteable agent contracts
- [x] 12 scenario cards in references/prompts/scenarios/
- [x] DROPZONE watcher in apply-diff.ps1
- [x] 8 scenario wrapper .bat files in hands/scenarios/
- [x] CORP-SEC CONSTRAINTS: hard rules in BELT
- [x] WEAPONS FACTORY purge audited: archive/research/prompts restored as classified cold storage, not hot-path clutter
- [x] 2026-07-17 architecture pass: canonicalized `prep scan -> SCOPE -> prep grid -> SHOT`, fixed current-repo defaults, hardened Lane B pack output, and smoke-tested dispatcher/card flows

### AREA CLEARED: Prep Command Surface
- Trigger Finding: `BELT.md` advertised `boot/task/apply/recon`, while checklists and scripts used `prep scan/grid/outside/card`.
- Seed of Suspicion: The OS and executable layer had forked; under pressure, agents would boot the wrong role order or scan the `personal` repo instead of the target repo.
- Blast Radius Findings (Pass 2): `prep outside` passed an unsupported `-Mission`; `run-card.ps1` skipped one-line prep steps on CRLF files; `-NoTabs` did not flow through card mode; clipboard failures printed false "copied" messages.
- Systemic Sweep (Pass 3): Searched `BELT.md`, formula backup, scenario cards, checklists, and launchers for stale `recon` / Tab1=SCOPE assumptions; only the intentional legacy `recon` command remains.
- Total Eradications: 17 workflow fixes across docs, dispatcher scripts, card runner, boot prompts, clipboard handling, and Lane B pack redaction.

### AREA CLEARED: Archive Value Recovery
- Trigger Finding: Commit `b4af65c` deleted `references/archive/`, reusable prompt artifacts, and `research/` under the claim that anything outside contracts/formulas/scenarios/launchers was dead weight.
- Seed of Suspicion: The OS compressed "not needed for hot boot" into "not valuable", which destroys prompt DNA, learning systems, research source material, and the story behind current doctrine.
- Blast Radius Findings (Pass 2): `BELT.md`, `AGENTS.md`, `SCRATCHPAD.md`, `SESSION.md`, and formula references repeated the same deletion doctrine; current boot docs also advertised stale `boot -> task -> apply` wording.
- Systemic Sweep (Pass 3): Restored the deleted archive/research/prompts from the parent of `WEAPONS FACTORY`, added a recovery index, and changed the rule from "delete anything else" to "extract, classify, or ledger before deletion."
- Total Eradications: 55 restored knowledge artifacts plus 5 doctrine/ledger corrections.

## Active Tasks
- [ ] Commit and push all changes
- [ ] Test BELT.md in fresh agent session
- [x] Test scenario card under pressure
- [ ] Re-test BELT.md in a fresh web/IDE agent after this architecture pass

## Blockers
None

## Next Actions
1. Commit + push
2. Test BELT.md transformation in a fresh agent
3. Run the 15-min unknown-repo checklist on a real target repo
