# OUTSIDE BRAIN MODE — Redacted Structures Only

**Use this when:** You need product/architect thinking from external AI (Claude, ChatGPT, Gemini) but CANNOT paste any corp code.

**Rule:** Run `pack -Pack ultra -Anonymize` on target files first. Paste ONLY the output below.

---

## TRANSFORM CHECKLIST (run before every external paste)

- [ ] `pack -SourceDir ./src -Pack ultra -Anonymize` → clipboard
- [ ] Verify output contains NO: company names, project names, customer names, real URLs, API keys, DB schemas, internal package names
- [ ] Verify output contains ONLY: type signatures, route paths, state action names, config keys, interface shapes
- [ ] If any secret slips: discard, fix, re-run

---

## EXTERNAL PROMPT SKELETON

Paste this + the Pack=ultra output into external AI:

```
You are designing a product and architecture for an ANONYMIZED system.

You get:
- ROUTES: [paste route list from pack output]
- TYPES: [paste type/function signatures from pack output]
- STATE: [paste state actions/stores from pack output]
- CONFIG: [paste anonymized feature flags from pack output]

DO NOT:
- Ask for full code
- Assume company/industry details
- Invent business logic not in the types

OUTPUT:
1. PRODUCT THESIS (1 line): who, what job, what outcome
2. PRIMARY JOURNEY (3-5 steps): entry → core action → outcome
3. 3 FLOWS TO KEEP (from routes/types): why they matter
4. 3 FLOWS TO CUT/MERGE: why they're noise
5. EXECUTION_QUEUE (5 tasks): user outcome | types/files to touch | acceptance
6. 5 UX CORRECTIONS: hierarchy | states | trust | flow | edge case

Format: Markdown. No chat. End with: NEXT
```

---

## PACK OUTPUT FORMAT (what you paste)

The `pack -Pack ultra -Anonymize` command outputs:

```markdown
## ROUTES
GET    /api/v1/[REDACTED]/[REDACTED]
POST   /api/v1/[REDACTED]/[REDACTED]
GET    /[REDACTED]/[REDACTED]/:id
...

## TYPES
interface [REDACTED] { id: string; [REDACTED]: string; createdAt: Date }
type [REDACTED]Action = { type: '[REDACTED]'; payload: [REDACTED] }
function [REDACTED](input: [REDACTED]): Promise<[REDACTED]>
class [REDACTED]Service { [REDACTED](params: [REDACTED]): [REDACTED] }
...

## STATE
store: [REDACTED]Slice
actions: [REDACTED]/fetch, [REDACTED]/create, [REDACTED]/update, [REDACTED]/delete
selectors: select[REDACTED], select[REDACTED]ById
...

## CONFIG
featureFlags: { [REDACTED]: boolean, [REDACTED]: boolean }
envKeys: [REDACTED]_API_URL, [REDACTED]_CLIENT_ID
...
```

---

## ROUND-TRIP WORKFLOW

```
INTERNAL (Lane A)                    EXTERNAL (Lane B)
─────────────────────                ─────────────────────
1. pack -Pack ultra -Anonymize    →  2. Paste into external AI
3. Get PRODUCT_SPEC + QUEUE       ←  4. External outputs design
5. Internal Copilot implements     ←  6. Design informs implementation
7. Tests pass, ICK_AUDIT clean     ←  8. External auditor reviews screenshots
```

**Never mix lanes.** Lane A sees real code. Lane B sees only shape.

---

## COMMON REDACTION PATTERNS

| Original | Redacted |
|----------|----------|
| `AcmeCorp.UserService` | `[REDACTED]Service` |
| `https://api.acmecorp.com/v1/users` | `[INTERNAL_URL]` |
| `process.env.ACME_API_KEY` | `[API_KEY_PLACEHOLDER]` |
| `interface AcmeUser { ... }` | `interface [REDACTED]User { ... }` |
| `table: acme_users` | `[SCHEMA_REDACTED]` |
| `feature: 'new-onboarding-v2'` | `feature: '[REDACTED]'` |

**If in doubt: redact it.** External AI doesn't need your naming conventions.