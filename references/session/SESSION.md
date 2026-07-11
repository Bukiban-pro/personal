# SESSION.md

AI maintains this file automatically throughout the session. No human prompting needed.
Survives context resets, tool switches, and PREEMPTION.

```markdown
# Session: YYYY-MM-DD

## Mission
<one line>

## Formula
core + <profile> + <task>

## Energy
<20%/50%/80%/100%>

## Persona
<Teacher/Builder/Surgeon/Warrior/Explorer>

## Environment
Tool: <Class A/B/C>
Budget: <profile>
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
| src/... | drafted | needs review |

## Decisions
- 1: <decision> — <rationale>

## PREF Log (auto-captured)
Every human correction encoded as a permanent rule:
- 1: <trigger> → <rule>

## Blockers
- 1: <description>

## Next Action
/task opencode "Resume: <next step>"
```

## Session Harvest (AI writes on completion)

```markdown
## Harvest
- Outcome: shipped/reviewed/learned
- PREFs added: <count>
- Proposed updates to core-philosophy.md: <list>
- What to do better next time: <one thing>
```
