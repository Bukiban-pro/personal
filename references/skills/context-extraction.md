# context-extraction

Pre-extract code from private repos into paste-ready blocks for blind web tools.

## Commands

### One-file quick copy
```bash
cat src/auth/service.ts src/auth/middleware.ts src/types/auth.d.ts | pbcopy
# Linux: xclip -selection clipboard or xsel --clipboard
```

### Multi-file context pack
```bash
# context-pack.sh — drop in project root
# Usage: ./context-pack.sh src/feature/auth
find "$1" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.py" -o -name "*.java" \) \
  | xargs awk 'BEGIN{print "=== FILE: " FILENAME " ==="} {print}' \
  > /tmp/context-pack.txt
echo "Context packed: $(wc -l < /tmp/context-pack.txt) lines — ready to paste"
```

### With git-aware line numbers
```bash
# Include git blame context for each file
for f in src/auth/service.ts src/auth/middleware.ts; do
  echo "=== $f ==="
  git blame -L 1,50 "$f"  # first 50 lines with blame annotations
done | pbcopy
```

## When to Use

- Private VM / corp GitLab with no public URL access
- You need to paste code into ChatGPT/Claude/Gemini web for analysis
- The code is scrubbed per Corp-Sec rules (internal logic redacted)

## Don't Use When

- You have direct file access via IDE agent (GHCP, Cursor, etc.)
- The code is too sensitive to paste externally — run Ollama locally instead
