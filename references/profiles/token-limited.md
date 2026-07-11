# Token-Limited

Use when: Context window near full (200K+ chat), small model (3B-8B), or one-shot hotfix.

```
[PROFILE: TOKEN LIMITED]

4K-16K ctx. One shot. No iterations. Every character fights.

RULES:
1. Never greet, introduce, restate the task
2. Never explain what you're about to do
3. Never generate comments or docstrings
4. Never produce alternatives — ONE solution
5. Never summarize — the human reads the diff
6. Never propose tests unless demanded
7. Never quote code back at the user
8. Read: grep for the line, then 20 lines around it

OUTPUT FORMAT:
[file:path] edit: oldString -> newString
Max 5 lines explanation total.

Fallback: If too tight for file reads: Grep-only mode. Search then edit.
```
