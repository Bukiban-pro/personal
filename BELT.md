# BELT

```
┌─────────────────────────────────────────────────────────────┐
│                      THE UTILITY BELT                       │
│     One file. Every realm. Zero friction. Double-click.     │
│     boot → task → apply → archive. Daily. Compound. Win.   │
└─────────────────────────────────────────────────────────────┘
```

## MORNING (30s)

| Step | What |
|------|------|
| 1 | Open terminal → `boot "today's mission"` |
| 2 | Tab 1 (Claude) opens. Paste. It produces PLAN.md. |
| 3 | `task -Task "top item from PLAN" -Tool chatgpt -Profile <energy>` |
| 4 | Tab 2 (ChatGPT) pasted. It produces diff. |
| 5 | `apply` → diff applied, tests run, logged. |
| 6 | Repeat 3-5 until mission done. |
| 7 | End of day → `archive` → SESSION.md resets. |

**Energy-based profile selection:**
```
100% → unlimited (ship fast, 5 alternatives)
 80% → your-profile (pick from profiles below)
 50% → token-limited (diff only, no commentary)
 20% → boot only, read, don't ship
```

## PROFILES (pick one per task)

| Profile | When | What it does |
|---------|------|-------------|
| `unlimited` | Full energy | Senior engineer. Production-grade. 5 alternatives. Ship. |
| `token-limited` | Low energy | Code review. Just the diff. No greetings, no explanations. |
| `corp-sec` | Audited env | [REDACTED] everything. Synthetic data. No real URLs. |
| `stealth` | No internet | Self-contained. Zero deps. Document every command. |

## COMMANDS (work from any terminal, any directory)

| Command | What it does |
|---------|-------------|
| `boot "mission"` | Opens 4 AI tabs. Copies OS prompt. ENTER advances to next tab. |
| `task -Task "x" -Tool y -Profile z` | Reads files, packs context, copies prompt. |
| `apply` | Pastes clipboard diff → safety branch → apply → test → log. |
| `pack -SourceDir src` | Packs any directory to clipboard. For blind web tools. |
| `recon -RepoPath .` | Analyzes unknown repo. File tree + packages + git log. |
| `archive` | Archives SESSION.md to SESSION_HISTORY.md. Fresh start. |

## DEBUG (when stuck)

```
1. "what did I just do?" → git log --oneline -5 + HANDS_LOG.md
2. "what broke?" → describe symptom. Run recon. Paste to Claude.
3. "how to fix?" → Claude produces PLAN. task → apply. Test. Done.
```

## EVENING (30s)

```
1. Did I ship? Yes/No. If No: one sentence why.
2. What did I learn? One sentence → append to SCRATCHPAD.md.
3. archive → SESSION.md resets to fresh start.
```

## THE RULE

```
Every interaction makes the next one faster.
You are not competing with others. You are competing with yesterday.
If today didn't beat yesterday: the system failed or you did.
Fix the system first. Fix yourself second. Both compound.
```

## QUICKSTART (first time)

```powershell
# One double-click. That's it.
init.bat --install
# Now reboot. Then:
boot "first mission"
```
