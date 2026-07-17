# AGENTS.md - Boot Loader

**Before any task, read and adopt `BELT.md` as your operating system.**
This one file is the hot-path prep OS: roles, prompts, artifacts, acceptance checks, constraints.

Boot: AGENTS.md -> BELT.md (load OS) -> SESSION.md (resume state) -> task.

Scripts: `prep` -> `task` -> `apply`. One dispatcher, one terminal, zero friction.

`references/archive/` and `research/` are cold memory, not hot boot dependencies. Do not delete them unless their unique value was extracted into a better artifact or a ledger explains why they are truly obsolete.
