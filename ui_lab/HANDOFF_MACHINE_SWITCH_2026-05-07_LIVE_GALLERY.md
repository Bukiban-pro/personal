# Machine Switch Handoff - Landing Product Galleries (2026-05-07)

## Objective Reached
- The archive now has two browsing surfaces:
  - Static browse gallery (curated map + anti-repeat posters)
  - Live render gallery (actual React runtime rendering for curated samples)

## Current Verified Outputs
- Static gallery HTML: `ui_lab/library/landing-product-gallery.html`
- Static gallery JSON: `ui_lab/library/landing-product-gallery.json`
- Visual playbook markdown: `ui_lab/docs/LANDING_PRODUCT_VISUAL_PLAYBOOK.md`
- Live gallery HTML: `ui_lab/library/landing-product-live-gallery.html`
- Live proof page (earlier probe): `ui_lab/library/landing-product-live-probe.html`

## Core Generators
- Static gallery generator: `ui_lab/docs/generate-landing-product-visual-gallery.ps1`
- Live gallery generator: `ui_lab/docs/generate-landing-product-live-gallery.ps1`

## Live Gallery Inputs
- Live sample config: `ui_lab/configs/landing-product-live-samples.json`
- Live gallery currently renders 6 real components:
  - LandingProductPilotProgram
  - LandingProductPricingControls
  - LandingProductRegionalRollout
  - LandingProductStakeholderMap
  - LandingProductOnboardingChecklist
  - LandingProductStoryTimeline

## Regenerate Everything (first command on new machine)
Run from repo root:

```powershell
Set-Location 'c:\Users\YOGA\Desktop\personal'; .\ui_lab\docs\generate-landing-product-visual-gallery.ps1; .\ui_lab\docs\generate-landing-product-live-gallery.ps1
```

## Open Surfaces
- Static browse gallery:
  - `file:///C:/Users/YOGA/Desktop/personal/ui_lab/library/landing-product-gallery.html`
- Live render gallery:
  - `file:///C:/Users/YOGA/Desktop/personal/ui_lab/library/landing-product-live-gallery.html`

## Important Notes
- Live gallery is intentionally curated, not full-321 automatic rendering.
- Live rendering uses browser-side React + Babel + Tailwind CDNs for local file execution.
- Browser warnings about Tailwind CDN and Babel are expected in this local preview mode.
- Static gallery now includes a direct link to live gallery in the hero cards.

## Files Changed In This Push
- `ui_lab/README.md`
- `ui_lab/configs/landing-product-gallery-profiles.json`
- `ui_lab/configs/landing-product-live-samples.json`
- `ui_lab/docs/LANDING_PRODUCT_VISUAL_GALLERY_MAP.md`
- `ui_lab/docs/LANDING_PRODUCT_VISUAL_PLAYBOOK.md`
- `ui_lab/docs/generate-landing-product-visual-gallery.ps1`
- `ui_lab/docs/generate-landing-product-live-gallery.ps1`
- `ui_lab/library/landing-product-gallery.html`
- `ui_lab/library/landing-product-gallery.json`
- `ui_lab/library/landing-product-live-gallery.html`
- `ui_lab/library/landing-product-live-probe.html`

## Recommended Immediate Next Step
- Expand `ui_lab/configs/landing-product-live-samples.json` from 6 to 20+ curated components (cover all 6 chapters), then rerun the live generator.
