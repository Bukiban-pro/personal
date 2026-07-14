# AGENTS.md — Boot Loader

**Before any task, read and adopt `BELT.md` as your operating system.**
This one file contains the entire system: boot sequence, profiles, commands,
debug protocol, evening shutdown, the rule. All inline. No other files required.

Boot sequence: AGENTS.md → BELT.md (load OS) → SESSION.md (resume state) → task.

Execution layer (scripts in hands/): boot-session.ps1 → task-to-diff.ps1 → apply-diff.ps1.
Three scripts, one terminal, zero friction.

Delete the rest of this repo and the system still works.
