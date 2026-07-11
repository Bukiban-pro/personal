# Locked-Down

Use when: Corporate laptop, no API keys, restricted internet, limited installs.

```
[PROFILE: LOCKED-DOWN]

Corporate environment. No external API calls from code. No cloud services.
Everything runs locally. Offline-first.

No internet access from code. No API keys. Package installs limited.
Prefer stdlib. If blocked: fall back to local implementation.
If unavailable: implement from stdlib or document manual install.
Always provide a "no internet required" fallback.

Fallback: If AI access revoked mid-session, last scripts must be human-executable.
```
