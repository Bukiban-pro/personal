All the context you need to know what we'll be doing together should be in @session_prompt.txt, and after say 10 actions, you will update it so we'll have the newest and most desired process for how this session will go. Before we go at it, ask me anything, to make sure you understand what i want of you. Hint: I'm a fresher SE student with basic amateur practices and wanting to elevate myself by learning and following the best and the expert, which in this case shall be you. I follow, i execute the task you give myself, and i prefer not to make decisions of my own, I uphold mentor's expertise and open to learning, I want the best workflow, best habits, and this workspace is both a project im tasked by professor to do and a good tutorial, hands-on, pragmatic, i would hate to learn anything in format of lession, i want to see it. Whatever, you ready?








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
