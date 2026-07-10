# Reference: Standardized Project Directory Structure

## Learning & Collaboration Context
> I am a fresher Software Engineering student seeking to elevate my practices by learning from expert workflows. I prefer a hands-on, pragmatic approach over traditional lessons; I want to see the best habits in action. This workspace serves as both a live project and a tutorial. I uphold the mentor's expertise and focus on execution rather than independent high-level decision-making.

---

## 1. Canonical Repository Structure








my-project/
├── .github/                               # GitHub configuration
│   ├── ISSUE_TEMPLATE/                    # PR & issue templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── workflows/                         # CI/CD workflows
│   │   ├── ci.yml                         # Lint, test, build, coverage
│   │   └── release.yml                    # Automated releases
│   └── CODEOWNERS                         # Defines mandatory reviewers
│
├── .husky/                                # Git hooks
│   ├── pre-commit                         # Runs lint + tests locally
│   └── pre-push                           # Runs type-checks before pushing
│
├── docs/                                  # Documentation
│   ├── adr/                               # Architecture Decision Records
│   │   └── 0001-record-architecture.md
│   ├── api/                               # API reference (OpenAPI, GraphQL docs)
│   │   └── openapi.yaml
│   └── architecture.md                    # System diagrams & overview
│
├── src/                                   # Application source code
│   ├── components/                        # UI or shared components
│   │   └── Button.tsx
│   ├── services/                          # Business/domain services
│   │   └── authService.ts
│   ├── hooks/                             # Custom reusable logic
│   │   └── useAuth.ts
│   └── lib/                               # Helpers, utilities
│       └── fetcher.ts
│
├── tests/                                 # Testing
│   ├── unit/                              # Unit tests
│   │   └── auth.test.ts
│   ├── integration/                       # Integration tests
│   │   └── api.test.ts
│   └── e2e/                               # End-to-end tests
│       └── login.test.ts
│
├── .editorconfig                          # Editor settings
├── .env.example                           # Example env vars (never commit real .env)
├── .gitignore
├── .prettierrc                            # Code formatting rules
├── CODE_OF_CONDUCT.md                     # Contributor behavior guidelines
├── CONTRIBUTING.md                        # How to contribute
├── LICENSE                                # Project license (MIT/Apache/etc.)
├── SECURITY.md                            # Security policy & how to report vulnerabilities
├── eslint.config.mjs                      # Linter config
├── jest.config.js                         # Testing config
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript config
└── README.md                              # Project overview
