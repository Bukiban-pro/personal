# token-packing

Maximize value per token budget. For zero-budget and token-limited environments.

## Token Budget Reference

### Core (always start here)
| Component | Est. Tokens |
|-----------|-------------|
| core-philosophy.md | ~400 |

### Profiles
| Profile | Est. Tokens | When to use |
|---------|-------------|-------------|
| unlimited | ~150 | Full context available |
| locked-down | ~200 | No internet, local only |
| zero-budget | ~300 | Minimize every token |
| token-limited | ~250 | Limited but not zero |
| adaptive | ~400 | Unknown tool environment |
| stealth | ~350 | Corp-blocked, no URLs |
| corp-sec | ~400 | Zero-trust compliance |

### Task Prompts
| Component | Est. Tokens |
|-----------|-------------|
| agent-session-kickoff.md | ~500 |
| agent-role-definitions.md | ~800 |
| inquisitor-system.md | ~700 |
| dev-leroy-reviewer.md | ~600 |
| investor-demo-copilot.md | ~500 |
| agents-template.md | ~300 |

### Frameworks & Skills
| Component | Est. Tokens |
|-----------|-------------|
| dev-mode-blueprint.md | ~400 |
| dual-agent-concurrency.md | ~300 |
| web-brain-agentic-hands.md | ~350 |
| tool-abstraction-layer.md | ~500 |
| Any skill card | ~200-400 each |

### Workflows
| Component | Est. Tokens |
|-----------|-------------|
| ship-feature.md | ~300 |
| debug-incident.md | ~300 |
| review-pr.md | ~300 |
| design-ui-flow.md | ~300 |
| research-topic.md | ~300 |
| cold-start.md | ~200 |

## Packing Formulas

### Budget: 500 tokens (absolute minimum)
```
core(400) + stealth(350) = 750
```
Can't fit in 500. Use a compressed profile directly, or:
```
zero-budget(300) + task(200) = 500
```

### Budget: 1000 tokens
```
core(400) + zero-budget(300) + task(300) = ~1000
```
OR
```
core(400) + task(600) = ~1000
```

### Budget: 1500 tokens
```
core(400) + token-limited(250) + kickoff(500) + task(350) = ~1500
```

### Budget: 2000 tokens
```
core(400) + unlimited(150) + kickoff(500) + role(800) + task(150) = ~2000
```

### Budget: 3000 tokens (comfortable)
```
core(400) + adaptive(400) + kickoff(500) + role(800) + tool-abs(500) + task(400) = ~3000
```

## Algorithm

1. Start with core (400 tokens minimum)
2. Add profile (150-400 tokens based on environment)
3. Add task prompt (300-800 tokens based on complexity)
4. If budget remains: add skill card or framework interface
5. Describe the task last

### Compression tricks
- Skip headers, skip explanations, paste only the directives
- Use `core-philosophy.md` as self-contained boot (saves ~100 tokens over core + profile)
- For tasks under 800 tokens: paste core-philosophy + task description only
- For review tasks: load dev-leroy directly (no core, no profile)
