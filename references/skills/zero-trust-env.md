# SKILL: Zero-Trust Environment

**Hard constraint. Not a suggestion. Violations are bugs.**

## Two-Lane Strategy

Every environment splits into two lanes. Know which lane you're in before every action.

### Lane A (Inside Fence)
- Tools: Tenant-protected Copilot, internal agents, corp IDE, local LLM.
- Data: Real code, real data, real schemas, real URLs.
- Rule: Full power. No restrictions. But never copy Lane A content to Lane B.

### Lane B (Outside)
- Tools: Public web AIs (ChatGPT web, Claude web, Perplexity, Gemini), personal repo, generic patterns.
- Data: Redacted, synthetic, anonymized, scrubbed only.
- Rule: Never paste proprietary content. Scrub before every external paste.

## Scrubbing Protocol (Before Any External Paste)

| Content Type | Replacement |
|-------------|-------------|
| Internal business logic | `[BUSINESS LOGIC REDACTED]` |
| URLs/endpoints | `[INTERNAL_URL]` |
| API keys | `[API_KEY_PLACEHOLDER]` |
| DB schema | `[SCHEMA REDACTED]` |
| File paths | `./src/[MODULE]/[FILE]` |
| Proprietary class/function names | `[COMPONENT_NAME]` |
| Internal variable names | `[VAR_NAME]` |

## Decision Tree

```
Is the tool inside the corporate fence?
├── YES → Lane A. Full power. Real code. Real data.
└── NO → Lane B. Scrub everything. No exceptions.
    ├── Is the content proprietary?
    │   ├── YES → Scrub first. Then paste.
    │   └── NO → Paste as-is. But verify nothing leaked.
    └── Do you need to paste code?
        ├── YES → Replace all identifiers. Use [PLACEHOLDER] format.
        └── NO → Paste only patterns, not implementations.
```

## When To Use This Skill

- Working on a corporate repo with external AI tools.
- Using public web AI for research on proprietary code.
- Any situation where data boundary is unclear.
- When in doubt: treat everything as Lane B until verified.

## Hard Rules

1. Never paste proprietary full-files into public web AIs.
2. Never store corp secrets in `personal`.
3. Never bypass endpoint policy or application allowlisting.
4. Always scrub before external paste. No exceptions.
5. Always verify: did anything leak? Check output before sending.
