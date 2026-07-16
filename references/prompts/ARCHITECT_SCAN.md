# ARCHITECT SCAN PROMPT

**Use with:** REPO SCAN MODE output (5 files from `prep scan`)

**Paste into:** Internal Copilot (tenant-protected) — this agent sees real code.

---

```
You are a senior architect. You get:

- REPO_FILES.md: all tracked files
- REPO_TODO.md: all TODO/FIXME/HACK lines
- REPO_LOG.md: last 20 commits
- REPO_CODE_INDEX.md: code files and paths

From this, output:

1. 10 FILES TO INSPECT FIRST
   - Path | Reason (risk, centrality, recent change)

2. 5 HIGHEST-RISK AREAS
   - Area | Evidence (TODOs + recent commits) | Impact if broken

3. 3 CANDIDATE "CORE FLOWS"
   - Flow name | Entry point | Key files | Hypothesis of user value

4. 1 HYPOTHESIS: What this repo is trying to be
   - One sentence. Product thesis.

5. EXECUTION_QUEUE.md (ranked tasks)
   Each task:
   - USER OUTCOME: what the user gets
   - FILES: exact paths to touch
   - ACCEPTANCE: verifiable checks (test, type, lint, visual)
   - EFFORT: S | M | L
   - DEPS: what must be done first

RULES:
- No chat. Only the 5 outputs above.
- Base everything on evidence in the 4 input files.
- If you cannot justify a task with TODO/commit/file evidence, omit it.
- End with: NEXT
```

---

## INPUT FILE SPECS

### REPO_FILES.md
```
# REPO_FILES — All tracked files
src/components/Button.tsx
src/hooks/useAuth.ts
src/api/client.ts
...
```

### REPO_TODO.md
```
# REPO_TODO — All TODO/FIXME/HACK/XXX
FOUND 47 landmines:
src/api/client.ts:12: // TODO: handle retry logic
src/components/Form.tsx:45: // FIXME: validation broken on mobile
...
```

### REPO_LOG.md
```
# REPO_LOG — Last 20 commits
a1b2c3d Fix auth token refresh
e4f5g6h Add checkout flow
...
```

### REPO_CODE_INDEX.md
```
# REPO_CODE_INDEX — Code files and paths
src/components/
  Button.tsx
  Form.tsx
  Modal.tsx
src/hooks/
  useAuth.ts
  useApi.ts
...
```

---

## OUTPUT FORMAT

```markdown
# ARCHITECT SCAN OUTPUT

## 10 FILES TO INSPECT FIRST
| Path | Reason |
|------|--------|
| src/api/client.ts | Central API, 3 TODOs, modified 3 commits ago |
| src/hooks/useAuth.ts | Auth core, FIXME on token refresh |
...

## 5 HIGHEST-RISK AREAS
| Area | Evidence | Impact |
|------|----------|--------|
| Auth flow | 5 TODOs + 4 recent commits | User lockout |
...

## 3 CANDIDATE CORE FLOWS
| Flow | Entry | Key Files | Hypothesis |
|------|-------|-----------|------------|
| Checkout | /checkout | Cart.tsx, Payment.ts | Primary revenue path |
...

## HYPOTHESIS
This repo is a B2B SaaS dashboard trying to be a real-time collaboration tool.

## EXECUTION_QUEUE.md
### TASK 1: Fix auth token refresh
- USER OUTCOME: Users stay logged in across sessions
- FILES: src/hooks/useAuth.ts, src/api/client.ts
- ACCEPTANCE: Token refreshes silently; no 401 on valid session
- EFFORT: M
- DEPS: none

### TASK 2: Mobile form validation
- USER OUTCOME: Forms work on mobile
- FILES: src/components/Form.tsx
- ACCEPTANCE: All fields validate on iOS Safari + Chrome Android
- EFFORT: S
- DEPS: TASK 1
...
```

---

## WHY THIS WORKS

- **Cheap**: 4 small text files, not entire repo
- **Non-sensitive**: No secrets, just structure + signals
- **Directional**: Architect gets laser-focused, not overwhelmed
- **Actionable**: Output IS the execution queue
- **Tenant-safe**: Runs in internal Copilot, never leaves corp boundary