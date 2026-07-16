# CARD: Stealth / Offline

**Formula:** core + stealth + local-pack

**Tool:** Local LLM only (Ollama, LM Studio) or no AI

**Prep (5 min):**
1. Run `pack` to pack the relevant repo slice to clipboard.
2. Run `recon` for repo intelligence.
3. Work entirely offline. No URLs. No cloud. No copy-paste to external.

**Agent contract:**
- Self-contained. Zero deps. Document every command.
- All context must be pre-packed (context-pack.ps1).
- All output goes to local files. No clipboard to external.
- If using local LLM: paste packed context + BELT.md into Ollama/LM Studio.

**Acceptance:** Zero network calls. All artifacts local. System survives disconnection.

**Rules:** Plane with no internet. Every command documented. Every output local.
