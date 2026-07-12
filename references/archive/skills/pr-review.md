# pr-review

Deploy when: reviewing any pull request. Language-agnostic.

## Checklist

- [ ] **Correctness**: does the change do what the PR description says?
- [ ] **Invariants**: does it break any existing contracts (API shape, DB schema, serialization)?
- [ ] **State management**: are loading/empty/error states handled? Optimistic updates consistent?
- [ ] **Error handling**: are failures logged, surfaced, recoverable? No swallowed exceptions.
- [ ] **Security**: new inputs sanitized? Auth checks in place? No secrets in code?
- [ ] **Performance**: N+1 queries? Unnecessary re-renders? Large payloads cached?
- [ ] **Testing**: edge cases covered? Negative paths tested? Tests actually fail when code breaks?

## Templates

**Small PR (< 100 lines):**
```
"Review this PR for correctness, state handling, and security.
Check: [paste diff]. Output: pass/fail per checklist item above."
```

**Large refactor:**
```
"This is a large refactor of <module>. Review for:
1. Behavioral equivalence (same inputs → same outputs?)
2. New dependencies introduced (are they justified?)
3. Dead code removed OR dead code accidentally left?
4. Test coverage: did tests change proportionally to code?
Output: summary table + top 3 risks."
```

## dev-leroy Hook

```
"Apply references/prompts/dev-leroy-reviewer.md to this PR.
Target repo: <URL>. Branch: <name>. Focus on: <area>."
```

## Artifacts
- `PR-REVIEW-<number>.md` — per-checklist-item verdict, root cause analysis, blocking vs non-blocking issues.
