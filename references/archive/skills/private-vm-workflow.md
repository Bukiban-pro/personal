# private-vm-workflow

Runbook for zero-trust corp: private GitLab on a VM, no external URLs, no public internet access to the repo.

## Access Points

You have exactly three physical access points. All tricks exploit these three.

1. **Terminal** (SSH/VPN into the VM or local clone) — context extraction, Ollama, git
2. **IDE** (VS Code, JetBrains) — GHCP works inside the network, reads private files directly
3. **Clipboard** — bridge private code to external web tools (scrubbed only)

## Decision Tree

```
Is the data sensitive?
├── YES (internal logic, APIs, schemas, PII-adjacent)
│   └── Ollama local (qwen2.5-coder / deepseek-coder-v2)
│       └── Boot core + Corp-Sec profile. Same OS, local execution.
└── NO (algorithmic patterns, syntax, open-source deps)
    └── Can you reach external tools?
        ├── YES → web tool (Claude/ChatGPT) with scrubbed snippets
        └── NO → GHCP in IDE (reads workspace context + AGENTS.md)
```

## Tools

### context-pack.sh — dump feature dir into one paste block

Drop this into the project root. One command, entire feature folder, paste-ready.

```bash
# Usage: ./context-pack.sh src/feature/auth
find "$1" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.py" -o -name "*.java" \) \
  | xargs awk 'BEGIN{print "=== FILE: " FILENAME " ==="} {print}' \
  > /tmp/context-pack.txt
echo "Context packed: $(wc -l < /tmp/context-pack.txt) lines"
```

Single-file version for quick paste:
```bash
cat src/auth/service.ts > /tmp/copy.txt
cat src/auth/middleware.ts >> /tmp/copy.txt
cat src/types/auth.d.ts >> /tmp/copy.txt
pbcopy < /tmp/copy.txt   # macOS — xclip/xsel on Linux
```

### Ollama — local LLM for sensitive code

```bash
ollama run qwen2.5-coder:32b    # best free-tier code model
ollama run deepseek-coder-v2     # strong alternative
```

Boot sequence: paste core-philosophy.md content + Corp-Sec profile + task. Same Gypsy Danger protocol. Zero data leaves the building.

### GHCP in VS Code — agent on private code

1. Check in AGENTS.md (from agents-template.md) into the corp project root
2. Open relevant files in VS Code
3. GHCP reads workspace context + AGENTS.md instructions
4. Slash commands (/ship, /debug, /review) work via Copilot Chat

## Triad Flow (Private VM Adaptation)

```
Terminal (context-pack) → copy → Tab 2 Planner (Claude web)
                                  ↓
                           outputs PLAN.md
                                  ↓
                           copy PLAN.md → paste into terminal → git commit
                                  ↓
                           Tab 3 Doer (ChatGPT) gets PLAN + code → produces DIFF
                                  ↓
                           copy DIFF → git apply < diff.patch
```

SESSION.md in the VM repo is shared state. Commit after each hand-off. External tools never reach in — artifacts flow via clipboard + git.

## Corp-Sec Profile Application

Before pasting anything externally, classify:

| Data Type | Destination | Rule |
|-----------|-------------|------|
| Business logic, internal APIs | Ollama only | Never pasted externally |
| Algorithm patterns, architecture | Web tools | Scrubbed — synthetic examples |
| Open-source deps, public code | Anywhere | No restriction |

## Formula

```
1. Classify data sensitivity
2. Sensitive → Ollama + Corp-Sec
3. Scrubbed/synthetic → web tools
4. IDE-accessible → GHCP + AGENTS.md
5. Artifacts flow via clipboard + git commit, never via URL
```
