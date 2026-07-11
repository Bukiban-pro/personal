# REFERENCES FORMULA — Master Deployment System

Nothing here is for reading. Find your cell. Follow the formula.

## Situation × Environment Matrix

| Situation | Unlimited | Locked-Down | Zero-Budget | Token-Limited |
|-----------|-----------|-------------|-------------|---------------|
| **Ship feature** | `core + unlimited + AGENTS + task` | `core + locked + AGENTS + task` | `core + zero + task` | `core + token + task` |
| **Review code** | `inquisitor` | `inquisitor` (offline) | `dev-leroy` (compressed) | `inquisitor` (grep only) |
| **Debug** | `core + unlimited + inquisitor` | `core + locked + problem` | `core + zero + problem` | `core + token + problem` |
| **Interview prep** | `learn + career` | `learn + career` (offline) | `learn + career` (compressed) | `learn + career` (cheatsheet) |
| **New project** | `core + unlimited + dev-mode + AGENTS` | `core + locked + dev-mode + AGENTS` | `core + zero + dev-mode` | `core + token + AGENTS` |
| **Investor demo** | `demo` | — | — | — |
| **Design UI** | `ui-design` | — | — | — |
| **Learn topic** | `learn` | `learn` (offline) | `learn` (3-pass) | `learn` (cheatsheet) |
| **Build infra** | `dev-mode` | `dev-mode` (local) | — | — |
| **Run multi-agent** | `protocol + web-brain` | — | — | — |

## Key

```
core        = references/prompts/core-philosophy.md  [the prepender only]
unlimited   = references/profiles/unlimited.md       [prepender]
locked      = references/profiles/locked-down.md     [prepender]
zero        = references/profiles/zero-budget.md     [prepender]
token       = references/profiles/token-limited.md   [prepender]
AGENTS      = references/prompts/copilot-instructions-template.md [deploy as ./AGENTS.md]
task        = your own prompt specifying what to build
problem     = paste bug report + error logs
inquisitor  = references/prompts/inquisitor-system.md
dev-leroy   = references/prompts/dev-leroy-reviewer.md
demo        = references/prompts/investor-demo-copilot.md
ui-design   = references/prompts/agent-role-definitions.md
learn       = references/frameworks/universal-learning-os.md
career      = career/developer-playbook.md
dev-mode    = references/frameworks/dev-mode-blueprint.md
protocol    = references/frameworks/dual-agent-concurrency-protocol.md
web-brain   = references/frameworks/web-brain-agentic-hands.md
```

## Deployment Order

```
1. core + [profile]      → prepend before task prompt (this is the OS)
2. AGENTS                → deploy as ./AGENTS.md in project root (this is the brain)
3. task                  → the actual prompt describing what to build
```

## Example

**Situation:** I need to ship a feature. I'm on a corporate laptop with no API keys.

**Formula:** `core + locked + AGENTS + task`

**Execution:**
```
1. Read references/prompts/core-philosophy.md      → take the [GYPSY DANGER PROTOCOL] block
2. Read references/profiles/locked-down.md          → take the prepender
3. Read references/prompts/copilot-instructions-template.md → deploy as ./AGENTS.md
4. Write your task prompt: "Build a user profile page with..."
5. Paste: [GYPSY DANGER PROTOCOL] + [locked-down prepender] + task
```

**Output:** Feature ships with testable artifacts. AGENTS.md grows wiser.

## Verification

After following any formula, check:
- [ ] Artifact exists (diff, test output, plan file, etc.)
- [ ] AGENTS.md updated with lessons learned
- [ ] Prepender installed the operating system (model behaves like Iron Man, not a generic assistant)
