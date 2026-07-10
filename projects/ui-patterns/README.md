# React Kit — Universal Pattern Reference

This repo started as a ~221-file React pattern stash. It now contains a much larger component tree with a dedicated LandingProduct subsystem, so the raw folder view is no longer a good first entrypoint.

## Current Status

- Flat root-level catalog files: 0
- Catalog component files under `components/shelves`: 588
- Component tree files including nested ui atoms: 634
- LandingProduct components: 321
- Repo-level shelves: 11
- Repo-level starter lanes: 4
- Grouped access layer files: 69
- Component source root: `projects/ui-patterns/components/shelves`
- Grouped access root: `projects/ui-patterns/library`
- By-name barrel: `projects/ui-patterns/library/by-name`
- Component index: `projects/ui-patterns/library/component-index.json`
- Shelf exact-component barrels: `projects/ui-patterns/library/shelves/*/components.ts`
- Starter-lane exact-component barrels: `projects/ui-patterns/library/starter-lanes/*/components.ts`
- Shelf metadata files: `projects/ui-patterns/library/shelves/*/meta.json`
- Starter-lane metadata files: `projects/ui-patterns/library/starter-lanes/*/meta.json`
- Repo-level misc shelf: 0
- Top-level named export collisions: 0
- LandingProduct chapters: 6
- LandingProduct starter kits: 5
- Inventory status: QA-checked against the file system and regenerated entrypoints via `projects/ui-patterns/docs/generate-ui-lab-library-catalog.ps1` and `projects/ui-patterns/docs/generate-landing-product-catalog.ps1`

## Start Here

1. Read `projects/ui-patterns/docs/UI_LAB_LIBRARY_GUIDE.md` for the repo-level shelf map, starter lanes, naming watchlist, and export-surface QA.
2. Browse `projects/ui-patterns/library/` when you want the generated shelf folders and starter-lane folders instead of walking the raw source tree.
3. Use `projects/ui-patterns/library/by-name/` when you know the component filename but not the shelf.
4. Use `projects/ui-patterns/library/component-index.json` when you need machine-readable lookup by component name, shelf, and starter-lane membership.
5. Use `projects/ui-patterns/components/shelves/` when you need the physical source files grouped by shelf.
6. Inside a shelf or starter-lane folder, use `components.ts` when you want exact file-name exports only and `index.ts` when you want the full module export surface.
7. Inside a shelf or starter-lane folder, use `meta.json` when you want folder-local machine-readable metadata without opening the repo-level registry.
8. Use `projects/ui-patterns/configs/ui-lab-registry.json` when you need the machine-readable root inventory.
9. Read `projects/ui-patterns/docs/UI_LAB_CURATION_QUEUE.md` for the active admin backlog around the remaining naming ambiguity.
10. Read `projects/ui-patterns/docs/UI_LIBRARY_METADATA_V2.md` for the proposed decision-grade metadata schema for components.
11. Read `projects/ui-patterns/configs/ui-library-manual-review-overrides.json` for the explicitly hand-reviewed subset and its written pushback.
12. Read `projects/ui-patterns/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md` when you are specifically entering the 321-file LandingProduct subsystem.
13. Use `projects/ui-patterns/configs/landing-product-registry.json` for the machine-readable LandingProduct inventory.
14. Read `projects/ui-patterns/docs/LANDING_PRODUCT_VISUAL_GALLERY_MAP.md` for a human visual-first wall map across the landing-product shelf.
15. Read `projects/ui-patterns/docs/LANDING_PRODUCT_VISUAL_PLAYBOOK.md` for chapter-level visual defaults, anti-repeat primary picks, and full wall browse links.
16. Open `projects/ui-patterns/library/landing-product-live-gallery.html` when you want actual rendered LandingProduct sections instead of file browse surfaces.
17. Use `projects/ui-patterns/library/landing-product-gallery.json` when you need machine-readable chapter color defaults and curated picks.
18. Use `projects/ui-patterns/configs/landing-product-live-samples.json` when you need the curated sample props that power the live render gallery.
19. Use `projects/ui-patterns/HANDOFF_UI_MINING_2026-05-06.md` as the full LandingProduct archive and source inventory.
20. Rerun `projects/ui-patterns/docs/generate-ui-lab-library-catalog.ps1`, `projects/ui-patterns/docs/generate-landing-product-catalog.ps1`, `projects/ui-patterns/docs/generate-landing-product-visual-gallery.ps1`, and `projects/ui-patterns/docs/generate-landing-product-live-gallery.ps1` after future inventory changes so guides and registries stay honest.

## What This README Still Covers

The inventory below is a legacy snapshot of the original base kit. It is still useful for the earlier cross-category stash, but it does not describe the full repo-level shelf map or the full 321-file LandingProduct surface.

Built from 8 audit phases:
1. **Clean** — extracted 47 raw files from 3 frontends
2. **Enrich** — design tokens, `size-N`, accessibility, dark mode
3. **Tony Stark polish** — motion system, confetti, audio, shimmer
4. **Layouts** — 8 composition shells (AppShell, SidebarLayout, AuthLayout...)
5. **Weaponize** — deep-mined own codebases (83 files)
6. **Diamond** — mined open-source repos (page-ui, shadcn, next-saas-starter, TailAdmin) → 142 files
7. **Creative Diamond** — mined portfolio/animation repos (Magic UI, Aceternity patterns) → ~180 files — motion primitives, interactive effects, decorative backgrounds, creative layouts, portfolio sections
8. **Premium Internet Robbery** — mined Apple clones, Stripe clones, Awwwards-level repos → ~221 files — scroll choreography, premium navigation, hero sections, text effects, premium cards, backgrounds, interactive elements, page experience

## Quality Standard

- **Design tokens only** — zero hardcoded grays/whites. All colors use `text-foreground`, `bg-background`, `border-border`, etc.
- **`size-N` everywhere** — no `h-4 w-4` when both values match. Uses `size-4`.
- **Accessibility** — focus traps, unique aria IDs (`useId()`), auto-focus on dialogs, keyboard support.
- **No code duplication** — identical functions aliased, shared `useReducedMotion` hook instead of inline `matchMedia`.
- **CSS keyframes included** — `globals.css` ships `shine`, `shimmer`, `slideInUp`, `marquee`, `ripple`, `shine-sweep`, `retro-grid-scroll`, `particle`, `meteor`, `blink`, `border-beam`, `gradient-text`, `glitch-top`, `glitch-bottom`, `wave-shift` animations + layout utilities.
- **Dark mode safe** — shimmer gradients use `foreground/5` not `white/40`.

## Editor Errors Are Expected

This is a stash folder, not an installed app. Your editor will report missing modules like `react`, `framer-motion`, etc. That's normal — errors vanish once you copy files into a project with deps installed.

## Dependency Install (all-at-once)

```bash
npm i react react-dom framer-motion clsx tailwind-merge class-variance-authority lucide-react canvas-confetti @radix-ui/react-slot @radix-ui/react-avatar @radix-ui/react-label @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-tooltip @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-radio-group @radix-ui/react-slider @radix-ui/react-toggle @radix-ui/react-progress @radix-ui/react-accordion @radix-ui/react-tabs @radix-ui/react-scroll-area @radix-ui/react-collapsible @radix-ui/react-alert-dialog @radix-ui/react-separator swiper lottie-react react-simple-typewriter axios zustand react-hook-form cmdk zod
```

Most files need only a subset. Check the file header comment for its specific deps.

## Import Convention

Files use `@/` path aliases (e.g., `@/lib/utils`, `@/lib/motion`). Configure your `tsconfig.json`:

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

Or swap to relative imports when adopting individual files.

## Legacy Base-Kit Snapshot

### layouts/ (8 files)
`AppShell` · `AuthLayout` · `Footer` · `MobileBottomNav` · `PageContainer` · `PublicLayout` · `SidebarLayout` · `StickyHeader`

### components/ (98 files)
| Group | Files |
|-------|-------|
| **Sections** | `HeroSection`, `WelcomeSection`, `StatsGrid`, `FeatureGrid`, `CTASection`, `FAQSection`, `LogoCloud`, `SocialProof`, `ProductSteps`, `TestimonialGrid`, `PricingCards` |
| **Landing** | `AnnouncementBanner`, `Newsletter` |
| **Dashboard** | `BentoGrid`, `KPICard`, `DataTable`, `Breadcrumbs`, `Timeline`, `StepIndicator` |
| **Animation** | `AnimatedText`, `LottieAnimation`, `PageTransition`, `StaggerAnimation`, `Marquee` |
| **Media** | `ImageLightbox`, `ImageWithFallback`, `ProductCarousel`, `FileUpload` |
| **Feedback** | `OfflineBanner`, `TopLoadingBar`, `PageLoading`, `OverlayLoader`, `CookieConsent`, `ScrollToTop` |
| **State** | `EmptyState`, `ErrorState`, `ErrorBoundary`, `ConfirmDialog`, `AuthRequiredModal` |
| **Misc** | `GenericLogo`, `LazySection`, `StarRating`, `ThemeToggle` |
| **Motion Primitives** | `RevealOnScroll`, `BlurFade`, `TextReveal`, `ParallaxSection`, `ScrollProgress`, `TypingEffect` |
| **Interactive Effects** | `MagneticButton`, `TiltCard`, `Spotlight`, `CursorFollower`, `GlowCard` |
| **Backgrounds** | `DotPattern`, `GridPattern`, `RetroGrid`, `GradientBlobs`, `Particles`, `NoiseOverlay`, `Meteors` |
| **Creative Layouts** | `FloatingNav`, `Dock`, `HorizontalScrollSection`, `ImageReveal`, `GlassmorphismCard`, `BorderBeam` |
| **Portfolio** | `ProjectShowcase`, `TechStackGrid`, `SkillBars`, `AnimatedList`, `AnimatedGradientText` |
| **Scroll Choreography** | `ScrollPinSection`, `ScrollVideoPlayer`, `HighlightOnScroll`, `ZoomHero`, `StackedCards`, `ScrollSnapContainer` |
| **Premium Navigation** | `MegaMenu`, `SlideTabs`, `CommandMenu`, `MorphingNav`, `SideMenu` |
| **Hero Sections** | `GradientMeshHero`, `SplitHero`, `VideoHero`, `TextRotateHero` |
| **Text Effects** | `TextScramble`, `FlipText`, `NumberTicker`, `GlitchText`, `TextLoop` |
| **Premium Cards** | `SpotlightCards`, `FlipCard`, `ComparisonSlider`, `FeatureShowcase`, `ExpandableCard` |
| **Backgrounds (Phase 8)** | `AuroraBackground`, `WavyBackground`, `MeshGradient`, `SparklesEffect` |
| **Interactive Elements** | `DraggableCards`, `InfiniteCarousel`, `Accordion3D`, `InteractiveGrid` |
| **Page Experience** | `PagePreloader`, `CurtainReveal`, `CountUpStats` |

### components/ui/ (46 atoms)
`accordion` · `alert` · `alert-dialog` · `animated-button` · `animated-counter` · `animated-tabs` · `avatar` · `badge` · `button` · `card` · `checkbox` · `collapsible` · `command` · `dialog` · `divider-or` · `dropdown-menu` · `form` · `image-carousel` · `input` · `input-group` · `label` · `loading-button` · `pagination` · `password-input` · `popover` · `portal` · `progress` · `radio-group` · `resend-otp-button` · `ripple-button` · `scroll-area` · `select` · `separator` · `sheet` · `shiny-button` · `skeleton` · `slider` · `social-login-button` · `switch` · `table` · `tabs` · `textarea` · `toast` · `toaster` · `toggle` · `tooltip`

### hooks/ (31 hooks)
`useAnimationFrame` · `useAutoRefresh` · `useBeforeUnloadWarning` · `useClickOutside` · `useClipboard` · `useCountdown` · `useDebounce` · `useDeviceSize` · `useFilters` · `useFocusTrap` · `useFormShortcut` · `useHover` · `useIntersectionObserver` · `useKeyboardShortcuts` · `useLockScroll` · `useLocalStorage` · `useMediaQuery` · `useModal` · `useMousePosition` · `useMounted` · `useOnlineStatus` · `usePagination` · `useParallax` · `usePermissions` · `usePrefersColorScheme` · `usePrevious` · `useReducedMotion` · `useScrollDirection` · `useScrollProgress` · `useScrollSpy` · `useWindowSize`

### lib/ (15 utilities)
`audio` · `clipboard` · `confetti` · `date-utils` · `design-system-rules` · `error-utils` · `layout-constants` · `motion` · `relative-time` · `seo` · `split-text` · `storage` · `token-manager` · `utils` · `validation`

### providers/ (4)
`AuthProvider` · `NetworkStatusProvider` · `SmoothScrollProvider` · `TokenRefreshProvider`

### store/ (2)
`notification-store-template` · `ui-store-template`

### configs/ (3)
`apis-template` · `query-keys-template` · `routes-template`

### styling/ (1)
`globals.css`

## Highlights by Category

| Category | Standout Files |
|----------|---------------|
| **Layouts** | `AppShell` (3-col shell), `SidebarLayout` (collapsible + context), `AuthLayout` (centered/split) |
| **SaaS Landing** | `PricingCards` (3-tier + toggle), `TestimonialGrid`, `FAQSection` (accordion), `CTASection`, `LogoCloud`, `FeatureGrid`, `SocialProof`, `Newsletter`, `AnnouncementBanner`, `ProductSteps` |
| **Dashboard** | `BentoGrid` (CSS grid), `KPICard` (trend arrows), `DataTable` (sort/filter/paginate), `Timeline`, `StepIndicator`, `Breadcrumbs` |
| **Animation** | `motion.ts` (unified system), `PageTransition`, `StaggerAnimation`, `Marquee` (infinite scroll) |
| **Motion Primitives** | `RevealOnScroll`, `BlurFade`, `TextReveal`, `ParallaxSection`, `ScrollProgress`, `TypingEffect` |
| **Interactive Effects** | `MagneticButton`, `TiltCard`, `Spotlight`, `CursorFollower`, `GlowCard`, `ripple-button`, `shiny-button` |
| **Backgrounds** | `DotPattern`, `GridPattern`, `RetroGrid`, `GradientBlobs`, `Particles`, `NoiseOverlay`, `Meteors` |
| **Creative Layouts** | `FloatingNav` (scroll-aware pill nav), `Dock` (macOS magnification), `HorizontalScrollSection`, `ImageReveal`, `GlassmorphismCard`, `BorderBeam` |
| **Portfolio** | `ProjectShowcase` (gallery grid), `TechStackGrid`, `SkillBars` (fill-on-scroll), `AnimatedList`, `AnimatedGradientText` |
| **Scroll Choreography** | `ScrollPinSection` (pin + frame animation), `ScrollVideoPlayer` (scrub video to scroll), `HighlightOnScroll` (word-by-word), `ZoomHero` (scale-in), `StackedCards` (sticky stack), `ScrollSnapContainer` |
| **Premium Navigation** | `MegaMenu` (Stripe-style dropdown), `SlideTabs` (layoutId indicator), `CommandMenu` (⌘K palette), `MorphingNav` (scroll-morphing pill), `SideMenu` (off-canvas spring slide) |
| **Hero Sections** | `GradientMeshHero` (animated blobs), `SplitHero` (dual-panel), `VideoHero` (fullscreen bg), `TextRotateHero` (rotating headlines) |
| **Text Effects** | `TextScramble` (hacker decode), `FlipText` (3D rotateX), `NumberTicker` (spring counter), `GlitchText` (CSS pseudo glitch), `TextLoop` (cycling words) |
| **Premium Cards** | `SpotlightCards` (dim siblings), `FlipCard` (3D front/back), `ComparisonSlider` (before/after), `FeatureShowcase` (Stripe sticky), `ExpandableCard` (modal morph) |
| **Premium Backgrounds** | `AuroraBackground` (northern lights), `WavyBackground` (SVG waves), `MeshGradient` (morphing blobs), `SparklesEffect` (glitter particles) |
| **Interactive Elements** | `DraggableCards` (Tinder swipe), `InfiniteCarousel` (auto-scroll loop), `Accordion3D` (3D fold), `InteractiveGrid` (Dock-like proximity scale) |
| **Page Experience** | `PagePreloader` (cinematic load), `CurtainReveal` (theater wipe), `CountUpStats` (spring counters on scroll) |
| **Data Display** | `animated-counter`, `animated-tabs`, `image-carousel`, `StarRating`, `pagination` |
| **Feedback** | `toast` + `toaster` (imperative), `skeleton` (shimmer), `OfflineBanner`, `TopLoadingBar`, `CookieConsent`, `ScrollToTop` |
| **Forms** | `form` (RHF integration), `FileUpload` (drag & drop + preview), `input`, `textarea`, `select`, `checkbox`, `switch`, `radio-group`, `slider` |
| **Auth** | `AuthProvider`, `TokenRefreshProvider` (proactive JWT), `AuthRequiredModal` |
| **Hooks** | `useMediaQuery`, `useClickOutside`, `useLocalStorage`, `useLockScroll`, `useCountdown`, `useClipboard`, `useModal`, `useMounted`, `usePrevious`, `useMousePosition`, `useScrollProgress`, `useParallax` |
| **Lib** | `validation` (Zod presets + `validatedAction`), `seo` (Next.js metadata helpers), `relative-time` ("5 min ago"), `split-text` (word/char splitting + hook), `error-utils`, `token-manager`, `audio`, `date-utils` |
| **Config** | `query-keys-template` (TanStack factory pattern), `apis-template` (axios + interceptors), `routes-template` |
