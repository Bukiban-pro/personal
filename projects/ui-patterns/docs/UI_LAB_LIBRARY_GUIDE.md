# UI Lab Library Guide

This is the repo-level entrypoint. Use it to decide where to start before you dive into any single subsystem.

## Current Snapshot
- Catalog component files: 603
- Component tree files (including nested ui atoms): 649
- Source component shelf root: `projects/ui-patterns/components/shelves`
- LandingProduct components: 336
- Non-LandingProduct components: 267
- Legacy Landing* prefix components outside LandingProduct: 17
- Shelf count: 11
- Starter lanes: 4
- Grouped access root: `projects/ui-patterns/library`
- By-name barrel: `projects/ui-patterns/library/by-name`
- Component index: `projects/ui-patterns/library/component-index.json`
- Shelf exact-component barrels: `projects/ui-patterns/library/shelves/*/components.ts`
- Starter-lane exact-component barrels: `projects/ui-patterns/library/starter-lanes/*/components.ts`
- Shelf metadata files: `projects/ui-patterns/library/shelves/*/meta.json`
- Starter-lane metadata files: `projects/ui-patterns/library/starter-lanes/*/meta.json`
- Metadata v2 profiles: `projects/ui-patterns/configs/ui-library-metadata-v2-profiles.json`
- Component metadata v2: `projects/ui-patterns/configs/ui-library-component-metadata-v2.json`
- Component rankings v2: `projects/ui-patterns/configs/ui-library-component-rankings-v2.json`
- Manual review subset: 14 components
- Manual review overrides: `projects/ui-patterns/configs/ui-library-manual-review-overrides.json`
- Top-level named export collisions: 0
- Machine-readable registry: `projects/ui-patterns/configs/ui-lab-registry.json`
- Metadata specification: `projects/ui-patterns/docs/UI_LIBRARY_METADATA_V2.md`
- LandingProduct subsystem guide: `projects/ui-patterns/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md`
- Curation queue: `projects/ui-patterns/docs/UI_LAB_CURATION_QUEUE.md`
- Generator: `projects/ui-patterns/docs/generate-ui-lab-library-catalog.ps1`

## First Stops
1. Start with the starter lanes if you are building a page or product surface from scratch.
2. Use `projects/ui-patterns/library/by-name` when you know the component filename but not the shelf.
3. Jump into the LandingProduct subsystem only when you actually need enterprise page depth or page-scale systems language.
4. Treat the misc shelf and the naming watchlist as admin debt, not as default starting points.
5. Use `projects/ui-patterns/configs/ui-library-manual-review-overrides.json` when you need components with explicit stance, proof obligations, kill-switch criteria, and evidence references.

## Lookup Surfaces
- By-name barrel: `projects/ui-patterns/library/by-name`
- Machine-readable component index: `projects/ui-patterns/library/component-index.json`
- Each shelf and starter-lane folder now also ships `components.ts`, which exposes exact file-name entries without helper exports.
- Each shelf and starter-lane folder also ships `meta.json`, so folder-local machine-readable metadata lives next to the human README and barrels.

## Folder Map
- Library: `69` files in `projects/ui-patterns/library` (generated grouped access layer count)
- Components: `649` files in `projects/ui-patterns/components` (recursive component tree count)
- Layouts: `8` files in `projects/ui-patterns/layouts` (recursive folder count)
- Hooks: `31` files in `projects/ui-patterns/hooks` (recursive folder count)
- Lib: `15` files in `projects/ui-patterns/lib` (recursive folder count)
- Providers: `4` files in `projects/ui-patterns/providers` (recursive folder count)
- Store: `2` files in `projects/ui-patterns/store` (recursive folder count)
- Configs: `13` files in `projects/ui-patterns/configs` (recursive folder count)
- Docs: `18` files in `projects/ui-patterns/docs` (recursive folder count)
- Styling: `1` files in `projects/ui-patterns/styling` (recursive folder count)

## Starter Lanes

### Marketing Quickstart
- Use when: You need a standard marketing page without entering the heavier enterprise subsystem.
- Components: `HeroSection`, `FeatureGrid`, `SocialProof`, `PricingCards`, `CTASection`, `FAQSection`, `LogoCloud`, `AnnouncementBanner`

### Dashboard Core
- Use when: You are building a product or admin surface with metrics, tables, and workflow context.
- Components: `BentoGrid`, `KPICard`, `DataTable`, `AdvancedFilter`, `Timeline`, `StepIndicator`, `Breadcrumbs`, `NotificationCenter`

### Forms and Operations
- Use when: You need inputs, authoring, uploads, and filtering for real application workflows.
- Components: `FormInput`, `FormSelect`, `FormTextarea`, `AdvancedAutocomplete`, `DateRangePicker`, `FileUpload`, `BadgeInput`, `SearchFilter`

### Polish Layer
- Use when: The structure already works and you want motion, contrast, and visual depth without random ornament.
- Components: `AnimatedText`, `BlurFade`, `AuroraBackground`, `SpotlightCards`, `ComparisonSlider`, `PageTransition`, `TextScramble`, `GradientBlobs`

## Shelf Map

### LandingProduct System (336)
- Description: Enterprise landing/product sections with dedicated chapter guidance, starter kits, and deeper operating-model language.
- Good first picks: `LandingProductProof`, `LandingProductQBRFramework`, `LandingProductOperatingSystem`, `LandingProductTrustRegistry`
- Follow-up: use `projects/ui-patterns/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md` for the curated chapter map and starter kits.

### Landing and Marketing (38)
- Description: General marketing sections, landing-page building blocks, and non-LandingProduct conversion surfaces.
- Good first picks: `HeroSection`, `FeatureGrid`, `SocialProof`, `PricingCards`, `CTASection`, `FAQSection`, `AnnouncementBanner`, `Newsletter`

### Data and Admin (25)
- Description: Dashboards, tables, charts, monitoring, timelines, and administrative information surfaces.
- Good first picks: `BentoGrid`, `KPICard`, `DataTable`, `AdvancedFilter`, `Timeline`, `RadarChart`, `NetworkGraph`, `MetricsDashboard`

### Forms and Authoring (22)
- Description: Input systems, editors, uploads, search filters, and workflow authoring tools.
- Good first picks: `FormInput`, `FormSelect`, `FormTextarea`, `AdvancedAutocomplete`, `DateRangePicker`, `FileUpload`, `BadgeInput`, `RichTextEditor`

### Feedback and State (17)
- Description: Error states, dialogs, consent surfaces, loaders, and operational feedback layers.
- Good first picks: `Alert`, `ConfirmDialog`, `ErrorBoundary`, `ErrorState`, `CookieConsent`, `OverlayLoader`, `PagePreloader`, `TopLoadingBar`

### UI Primitives (11)
- Description: Small reusable surface elements used as atoms or composable presentation building blocks.
- Good first picks: `Avatar`, `Badge`, `Popover`, `Sheet`, `Tooltip`, `StatusBadge`

### Navigation and Command (12)
- Description: Menus, command surfaces, navigational scaffolding, and page-structure affordances.
- Good first picks: `CommandMenu`, `CommandPalette`, `FloatingNav`, `MegaMenu`, `MorphingNav`, `SideMenu`, `SlideTabs`, `Breadcrumbs`

### Motion and Typography (44)
- Description: Animated text, reveal systems, motion primitives, and presentation choreography.
- Good first picks: `AnimatedText`, `BlurFade`, `PageTransition`, `TextReveal`, `TextScramble`, `NumberTicker`, `TypingEffect`, `SparklesText`

### Backgrounds and Effects (40)
- Description: Ambient backgrounds, visual effects, particles, glow systems, and decorative depth layers.
- Good first picks: `AuroraBackground`, `GridPattern`, `GradientBlobs`, `Spotlight`, `Particles`, `RetroGrid`, `BorderBeam`, `WavyBackground`

### Interactive Showcase (58)
- Description: Carousels, mockups, cards, media comparison surfaces, and high-touch presentation components.
- Good first picks: `Accordion3D`, `ComparisonSlider`, `ExpandableCard`, `InfiniteCarousel`, `InteractiveGrid`, `ProductCarousel`, `SpotlightCards`, `ZoomHero`

### Misc and Uncurated (0)
- Description: Components that still need sharper shelf placement or clearer naming before they feel fully curated.
- Admin note: currently empty. Keep it that way.

## Naming Watchlist
These pairs are not automatically wrong, but they are the first place to inspect when the library feels ambiguous or redundant.
- `AuroraBackground` and `AuroraBackgroundEffect` share the `Effect` signal
- `BorderBeam` and `BorderBeamEffect` share the `Effect` signal
- `Confetti` and `ConfettiEffect` share the `Effect` signal
- `FileTree` and `FileTreeExplorer` share the `Explorer` signal
- `FlipCard` and `FlipCardEffect` share the `Effect` signal
- `LandingFAQ` and `LandingFAQCollapsible` share the `Collapsible` signal
- `LandingSocialProof` and `LandingSocialProofBand` share the `Band` signal
- `MagneticButton` and `MagneticButtonEffect` share the `Effect` signal
- `MegaMenu` and `MegaMenuComponent` share the `Component` signal
- `Safari` and `SafariMockup` share the `Mockup` signal
- `ScrollProgress` and `ScrollProgressBar` share the `Bar` signal
- `ScrollProgress` and `ScrollProgressIndicator` share the `Indicator` signal
- Additional watchlist entries in registry: 3

## API Surface
- No duplicate named exports found across catalog component files.

## QA Status
- Every component file is assigned to exactly one repo-level shelf.
- Every starter lane references existing components only.
- Every catalog component filename has an exact grouped entrypoint in `projects/ui-patterns/library/by-name`.
- Every shelf and starter-lane folder now has a strict `components.ts` barrel for exact file-name imports only.
- Every registry component now includes `decisionMetadataV2` with layered intent, eligibility, readiness, cost, character, and provenance fields.
- Every registry component now includes generator-authored heuristic notes, and manual review overrides are explicitly marked instead of being implied.
- Every component metadata record is emitted into `projects/ui-patterns/configs/ui-library-component-metadata-v2.json` with its generation mode and reviewer identity preserved.
- Every component also has a ranked summary in `projects/ui-patterns/configs/ui-library-component-rankings-v2.json` so the library can be compared at a glance.
- Physical shelf folders, when present, match the generator-owned shelf classification.
- Folder counts are generated from disk, not manually maintained.
- Top-level named component exports are collision-free.

## Refresh Command
```powershell
Set-Location 'C:\Users\YOGA\Desktop\personal'
.\ui_lab\docs\generate-ui-lab-library-catalog.ps1
```
