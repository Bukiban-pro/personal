# UI Lab Curation Queue

This file is the active admin queue for the remaining naming ambiguity in the library.

## Current Posture
- Naming watchlist items: 15
- Misc shelf components: 0
- Top-level named export collisions: 0
- Interpretation: the library is now structurally organized, and the remaining debt is mostly naming clarity rather than lost inventory.

## Immediate Priorities

### High Priority
- `FileTree` / `FileTreeExplorer` (`Explorer`): Document the explorer as the full interactive variant and keep the base name for the simpler tree surface only. Reason: Explorer implies a materially richer interaction model than a plain tree.
- `MegaMenu` / `MegaMenuComponent` (`Component`): Prefer a sharper semantic name or document the exact split between the generic and specific variant. Reason: The Component suffix adds almost no meaning and is the easiest way for a library to feel generic.
- `ScrollProgress` / `ScrollProgressBar` (`Bar`): Treat the bar as an explicit scroll-progress variant, not as another alias of the base component. Reason: Bar and indicator variants should read as one family with explicit roles.
- `ScrollProgress` / `ScrollProgressIndicator` (`Indicator`): Treat the indicator as an explicit variant and keep its API and docs separate from the base progress primitive. Reason: Indicator is a semantic role, not a cosmetic suffix.
- `Timeline` / `TimelineComponent` (`Component`): Prefer a sharper semantic name or document the exact split between the generic and specific variant. Reason: The Component suffix adds almost no meaning and is the easiest way for a library to feel generic.

### Medium Priority
- `AuroraBackground` / `AuroraBackgroundEffect` (`Effect`): Keep the base component as primary and document the effect file as a more decorative or specialized sibling. Reason: Effect variants are valid, but they need explicit positioning so they do not compete with the base primitive.
- `BorderBeam` / `BorderBeamEffect` (`Effect`): Keep the base component as primary and document the effect file as a more decorative or specialized sibling. Reason: Effect variants are valid, but they need explicit positioning so they do not compete with the base primitive.
- `Confetti` / `ConfettiEffect` (`Effect`): Keep the base component as primary and document the effect file as a more decorative or specialized sibling. Reason: Effect variants are valid, but they need explicit positioning so they do not compete with the base primitive.
- `FlipCard` / `FlipCardEffect` (`Effect`): Keep the base component as primary and document the effect file as a more decorative or specialized sibling. Reason: Effect variants are valid, but they need explicit positioning so they do not compete with the base primitive.
- `LandingFAQ` / `LandingFAQCollapsible` (`Collapsible`): Keep both only if the interaction model is materially different; otherwise this pair is a consolidation candidate. Reason: A behavior suffix must earn its existence through real interaction differences.
- `LandingSocialProof` / `LandingSocialProofBand` (`Band`): Document the band variant as a narrower layout treatment of the same content family. Reason: Band implies a layout constraint rather than a different conceptual primitive.
- `MagneticButton` / `MagneticButtonEffect` (`Effect`): Keep the base component as primary and document the effect file as a more decorative or specialized sibling. Reason: Effect variants are valid, but they need explicit positioning so they do not compete with the base primitive.
- `Safari` / `SafariMockup` (`Mockup`): Reserve the mockup variant for framed showcase use and keep the base name for the underlying renderer. Reason: Mockup signals packaging and presentation, not the same usage tier as the base component.
- `Spotlight` / `SpotlightEffect` (`Effect`): Keep the base component as primary and document the effect file as a more decorative or specialized sibling. Reason: Effect variants are valid, but they need explicit positioning so they do not compete with the base primitive.
- `TextReveal` / `TextRevealOnScroll` (`OnScroll`): Keep the trigger-specific variant only if scroll activation is the actual product difference, not just the implementation detail. Reason: Trigger-based naming should map to a meaningful usage distinction.

## Admin Guardrails
- Do not reintroduce duplicate top-level named exports while resolving naming pairs.
- Keep the misc shelf at zero. If a new component cannot be shelved cleanly, the classification model needs improvement before the library grows again.
- Prefer sharper semantic names over generic suffixes like `Component` when future renames are justified.

## Refresh Command
```powershell
Set-Location 'C:\Users\YOGA\Desktop\personal'
.\ui_lab\docs\generate-ui-lab-library-catalog.ps1
```
