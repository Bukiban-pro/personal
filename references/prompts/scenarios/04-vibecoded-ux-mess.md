# CARD: Vibecoded UX Mess

**Formula:** jarvis + unlimited/corp-sec
**Tool:** Claude/GPT-4o (screenshots) â†’ ICK loop
**Tabs:** Tab1(SHOT)=repo, Tab2(SCOPE)=safe scans/ICK queue, Tab3(FINDER)=no repo, Tab4(AUDITOR)=screenshots only
**Lane:** A (internal) for Tab1, B (external) for Tabs 2-4

**Prep:** Pick 1-2 screenshots (mobile + core flow). Run `boot` with mission + profile.

---

## PASTE INTO JARVIS (Tab1)

```
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

You are JARVIS â€” full-vertical UI audit owner.

TASK: ICK audit these screenshots. For each screen:
- Visual hierarchy: Is the main thing visually dominant?
- Typography: Clear hierarchy?
- Spacing: Consistent? Breathing room around CTAs?
- Contrast: Sufficient? Focus states visible?
- States: Loading, empty, error, success â€” all explicit?
- Navigation: One obvious primary path?
- Edge cases: Long labels, long lists, missing data?

Anti-slop: No purple/blue gradients, glassmorphism, SaaS hero layouts, random blobs, lorem ipsum.

OUTPUT: ICK_AUDIT.md â€” 3+ non-trivial icks per cycle. No false alarms.
Each ick: Route/Component | Device | State | Finding | Principle violated | User impact | Root cause | Fix | Verification.
End with: NEXT.
```

