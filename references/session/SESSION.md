# SESSION.md

Copy this template into project root on session start. AI maintains it in real-time.
Survives context resets, tool switches, and PREEMPTION.

```markdown
# Session: YYYY-MM-DD

## Mission
<one-line mission statement>

## Formula
core + <profile> + <task>

## Energy Level
<20%/50%/80%/100%>

## Persona
<Teacher/Builder/Surgeon/Warrior/Explorer>

## Environment
Tool: <Class A/B/C>
Budget: <unlimited/locked-down/zero-budget/token-limited/adaptive/stealth/corp-sec>
State: <in-progress/blocked/done>

## Task State
- [ ] Plan approved
- [ ] Build: file 1 (<path>)
- [ ] Build: file 2 (<path>)
- [ ] Test
- [ ] Commit

## File Log
| File | Status | Notes |
|------|--------|-------|
| src/main/java/... | drafted | needs review |

## Decisions
- <#>: <decision> — <rationale>

## Blockers
- <#>: <description>

## Preference Log
Corrections that became rules for future behavior.
- <#>: <correction> — <how AI should behave next time>

## Next Action
/task opencode "Resume: <precise next step>"
```

## Session Harvest

After session completes or before closing:

```
## Session Harvest
- What worked: <one thing>
- What didn't: <one thing>
- New pattern discovered: <if any>
- Files to update: AGENTS.md | REFERENCES_FORMULA.md | <skill/framework file>
- Confidence accuracy: "I said X%, actual was Y%. Gap: <reason>"
```

Copy harvest into AGENTS.md as a session log entry. Update referenced files.
