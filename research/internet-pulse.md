# Internet Pulse — Weekly External Scan

Your OS is internally coherent. This file is the feedback loop to the internet.
Update weekly. Source: HN, r/aipromptengineering, Simon Willison, Anthropic/OpenAI/Google release notes, own experimentation.

## 2026-07-11 — Initial

### New Tools Discovered
| Tool | Capability | Relevance |
|------|-----------|-----------|
| Ollama (qwen2.5-coder, deepseek-coder-v2) | Local code LLM, zero data leaves network | Primary for private VM sensitive code |
| GHCP in VS Code | Reads workspace context + AGENTS.md | Agentic IDE on private repos without URL access |

### New Tricks / Patterns
| Trick | Source | Deployable? |
|-------|--------|-------------|
| Raw GitHub URL as boot into any web tool | This session | Yes — universal boot sequence for ChatGPT/Gemini/Claude web |
| Three-tab triad (Finder→Planner→Doer) via Git as shared memory | This session | Yes — replaces MCP/API in the apocalypse stack |
| SESSION.md as cross-tab memory bus | This session | Yes — no context loss between tabs |
| PREF system as compounding edge | This session | Yes — already in core-philosophy.md |
| Context packs (pre-extract code → paste into web tools) | User spec | Yes — skills/private-vm-workflow.md + context-extraction.md |
| Private VM triad (terminal→clipboard→git commit) | User spec | Yes — clipboard as bridge, never URLs |
| Data classification before external paste (Corp-Sec profile) | User spec | Yes — already in Corp-Sec profile |

### Deprecated Patterns
| Pattern | Why | Replacement |
|---------|-----|-------------|
| Formula matrix as primary entry point | Too many steps before work | core-philosophy.md single paste |
| Assuming external URLs work | Private VM has no public internet | Context packs + clipboard bridge |

### Experiments to Run
- [ ] Test raw URL boot on ChatGPT web, Gemini, Claude web
- [ ] Test three-tab triad on a real feature
- [ ] Measure context retention with SESSION.md handoff
- [ ] Test context-pack.sh on a real feature folder
- [ ] Test Ollama + Corp-Sec profile for a sensitive code task
