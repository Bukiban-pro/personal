## Paranoid Free Model List (Copy-Paste Ready)

| Provider | **FREE Models Only** (No billing ever) | RPM Limits | Key Confirmation |
|----------|-------------------------------|------------|------------------|
| **Groq** | `llama-3.3-70b-versatile`<br>`mixtral-8x7b-32768`<br>`gemma2-9b-it` | 100+ RPM | ✅ `gsk_` works |
| **OpenRouter** | `deepseek/deepseek-r1:free`<br>`qwen/qwen3-coder:free`<br>`meta-llama/llama-3.2-3b:free` | 50-1000/day | ✅ `sk-or-` works |
| **Hugging Face** | `microsoft/Phi-3-mini-4k-instruct`<br>`Qwen/Qwen2.5-3B-Instruct`<br>`stabilityai/stablelm-3b-4e1t` | 300/hour | ✅ `hf_` works |
| **Mistral AI** | `mistral-small-3.2`<br>`open-mistral-nemo` | 1B tokens/month | ✅ `mapi-` works |
| **Cohere** | `command-r`<br>`command-r-plus` | 1000 reqs/month | ✅ Works |
| **Fireworks** | `accounts/fireworks/models/llama-3.1-8b-instruct`<br>`accounts/fireworks/models/mixtral-8x7b-instruct` | 100s/month | ✅ `fw-` works |

## Updated Rotator Code (Free Models ONLY)
```python
PROVIDERS = [
    {"name": "groq", "model": "llama-3.3-70b-versatile", "key": os.getenv("GROQ_KEY")},
    {"name": "openrouter", "model": "deepseek/deepseek-r1:free", "key": os.getenv("OPENROUTER_KEY")},
    {"name": "hf", "url": "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct", "key": os.getenv("HF_KEY")},
    {"name": "mistral", "model": "mistral-small-3.2", "key": os.getenv("MISTRAL_KEY")},
    {"name": "cohere", "model": "command-r", "key": os.getenv("COHERE_KEY")},
    {"name": "fireworks", "model": "accounts/fireworks/models/llama-3.1-8b-instruct", "key": os.getenv("FIREWORKS_KEY")}
]
```
