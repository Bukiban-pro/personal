# CARD: Zero-Budget Freelancer

**Formula:** core + zero-budget

**Tool:** Free models only (Groq, OpenRouter free tier, HuggingFace)

**Prep (5 min):**
1. Paste the task description.
2. Paste BELT.md.
3. State constraints: 2 files max, 1K output, free models only.

**Agent contract:**
- One solution, perfect. 2 files max. 1K output cap.
- Use free models: Groq (llama-3.3-70b), OpenRouter (deepseek-r1:free), HuggingFace (Phi-3-mini).
- No API key billing. No paid services.
- Output: the diff + test command. Nothing else.

**Acceptance:** Solution works. Within token budget. No paid services used.

**Model rotation:**
```
PROVIDERS = [
    {"name": "groq", "model": "llama-3.3-70b-versatile"},
    {"name": "openrouter", "model": "deepseek/deepseek-r1:free"},
    {"name": "hf", "model": "microsoft/Phi-3-mini-4k-instruct"}
]
```
