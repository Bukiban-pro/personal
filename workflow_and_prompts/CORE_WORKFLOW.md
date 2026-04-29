# 🛠️ Software Engineering Workflow

This document defines the **single source of truth** for our engineering process.  
Follow it strictly. Deviation = tech debt.

---

## 📂 Repository Structure

Every project should follow a **clean, predictable structure**:

```
.
├── .github/             # GitHub workflows, CODEOWNERS, issue templates
│   └── workflows/ci.yml
├── .husky/              # Pre-commit & pre-push hooks
├── docs/                # Documentation & ADRs
│   └── adr/
├── src/                 # Application source code
│   ├── components/      # UI components / library modules
│   ├── services/        # Business logic
│   ├── hooks/           # Shared logic
│   └── lib/             # Utils, helpers
├── tests/               # Unit & integration tests
├── .editorconfig        # Editor rules
├── .prettierrc          # Formatting rules
├── eslint.config.mjs    # Lint rules
├── package.json         # Dependencies
└── README.md            # Project overview
```

🔑 **Rule**: No “misc” folders. Every file has a clear home.

---

## 🌳 Branching Model

We use **Trunk-based development** with short-lived feature branches.

```
main ──────────────●─────────────●───────→ (always stable)
   └─ feat/login   ●───● merge → ●
   └─ fix/payment  ●─● merge → ●
```

- Default branch: `main`
- Feature branches: `feat/*`, `fix/*`, `chore/*`
- Merge only via Pull Request (PR)
- Branch lifespan < 3 days

---

## 💬 Commit Messages

Use **Conventional Commits**:

```
<type>(scope): <short description>
```

Examples:
```
feat(auth): add OAuth2 login
fix(api): handle null token in refresh
chore(ci): update GitHub Actions cache
```

---

## 🔎 Pull Requests

Every PR must:
- ✅ Be small (< 500 LOC changed)
- ✅ Have at least 1 reviewer (defined in CODEOWNERS)
- ✅ Pass all CI checks (lint, type-check, tests)
- ✅ Include tests for new logic
- ✅ Update docs if behavior changes

**PR Template Example**:

```markdown
## Summary
Short explanation of the change.

## Changes
- Added ...
- Fixed ...

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CI is green
```

---

## ✅ Quality Gates

All code must pass **before merge**:

1. **Lint & Format**  
   - ESLint + Prettier  
   - Run via `npm run lint && npm run format`

2. **Types**  
   - TypeScript or MyPy mandatory  
   - No `any` without justification

3. **Tests**  
   - Unit + integration  
   - Coverage ≥ 80%  

   Example test command:
   ```bash
   npm run test -- --coverage
   ```

4. **Security**  
   - Dependabot auto-updates  
   - CodeQL scan in CI

---

## ⚙️ CI/CD Pipeline

**GitHub Actions** handles all workflows.

```
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - checkout code
      - install dependencies
      - lint & type-check
      - run tests + coverage
      - build artifacts
      - upload coverage to Codecov
```

- **Preview envs**: Every PR deploys to staging URL  
- **Staging**: Auto-deploys from `main`  
- **Production**: Deploys only on version tag `vX.Y.Z`

---

## 📦 Versioning & Releases

We use **Semantic Versioning (SemVer)**:

```
MAJOR.MINOR.PATCH
```

Release workflow:
1. Merge PR → main
2. `semantic-release` bumps version
3. Changelog auto-generated
4. GitHub Release created
5. Package/docker image published

---

## 🩺 Observability

- **Logs**: Structured JSON  
- **Errors**: Sentry  
- **Metrics**: Prometheus + Grafana  
- **Tracing**: OpenTelemetry  

---

## 🔐 Security Rules

- Secrets never in repo (use GitHub Secrets or Vault)  
- Dependencies auto-scanned (Dependabot)  
- PR reviews enforce principle of least privilege  

---

## 📖 Documentation

Every repo must have:

- `README.md` → setup, usage, contribution guide  
- `CONTRIBUTING.md` → coding style, review rules  
- `CODE_OF_CONDUCT.md` → behavior standard  
- `/docs/adr/` → Architecture Decision Records  

---

## 👥 Culture & Collaboration

- Reviews check **readability + correctness + tests**  
- No "LGTM" only — explain reasoning  
- Pair programming encouraged for complex changes  
- Retrospectives after incidents  
- Blameless postmortems  

---

# 🚀 Final Notes

Follow this document = professional engineering standard.  
Ignore it = chaos, tech debt, slow delivery.

```
Professionalism = Consistency × Discipline × Automation
```
