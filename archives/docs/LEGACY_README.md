# .tmp — Personal UI/UX Pattern Stash

A portable, project-agnostic collection of **83 files** — layouts, components, hooks, lib utilities, providers, stores, and configs. Extracted and cleaned from three production React frontends. Grab what you need, adapt it, ship it.

---

## Structure

```
.tmp/
├── docs/
│   ├── adoption-notes.md            Quick-start guide
│   └── design-system.md             Design token reference + layout composition
│
└── react/
    ├── layouts/                      8 page-level layout shells
    │   ├── AppShell.tsx              3-column authenticated shell (header + sidebar + content + right panel)
    │   ├── AuthLayout.tsx            Centered card or 50/50 split for auth pages
    │   ├── Footer.tsx                Multi-column link grid with copyright bar
    │   ├── MobileBottomNav.tsx       iOS-style bottom nav with elevated center CTA
    │   ├── PageContainer.tsx         Constrained-width wrapper (7 size presets)
    │   ├── PublicLayout.tsx          Header + flex-1 content + footer
    │   ├── SidebarLayout.tsx         Collapsible sidebar (context + hook + localStorage + Ctrl+B)
    │   └── StickyHeader.tsx          Backdrop-blur glass header with 3 slots
    │
    ├── components/                   22 composed components
    │   ├── AnimatedText.tsx          Typewriter text effect
    │   ├── AuthRequiredModal.tsx     Action-specific auth gate (favorite/review/purchase/comment)
    │   ├── ConfirmDialog.tsx         Replace window.confirm()
    │   ├── EmptyState.tsx            Empty placeholder + CTA
    │   ├── ErrorBoundary.tsx         Class component error boundary
    │   ├── ErrorState.tsx            Full-page error with retry
    │   ├── GenericLogo.tsx           Image + text logo
    │   ├── HeroSection.tsx           Gradient hero with blur orbs, badge, stats, actions
    │   ├── ImageLightbox.tsx         Click-to-zoom overlay (0.5x–3x)
    │   ├── ImageWithFallback.tsx     Next/Image wrapper with typed fallback + shimmer
    │   ├── LazySection.tsx           Deferred render via IO + startTransition
    │   ├── LottieAnimation.tsx       Responsive Lottie wrapper
    │   ├── OfflineBanner.tsx         Fixed bottom "You're offline" bar
    │   ├── OverlayLoader.tsx         Fixed overlay with CSS spinner + scroll lock
    │   ├── PageLoading.tsx           Full-viewport centered spinner
    │   ├── PageTransition.tsx        AnimatePresence route wrapper
    │   ├── ProductCarousel.tsx       Swiper card carousel
    │   ├── StaggerAnimation.tsx      Stagger container + child variants
    │   ├── StarRating.tsx            Interactive star rating (1–5)
    │   ├── StatsGrid.tsx             Responsive stat cards (1→2→4 columns)
    │   ├── TopLoadingBar.tsx         NProgress-style loading bar (pure React + CSS)
    │   ├── WelcomeSection.tsx        Time-of-day greeting + action cards
    │   └── ui/                       19 primitive UI atoms
    │       ├── animated-button.tsx    Hover/tap spring + loading + shine
    │       ├── animated-counter.tsx   Count-up + Currency/Percent helpers
    │       ├── animated-tabs.tsx      Sliding indicator tabs (ARIA)
    │       ├── avatar.tsx             Radix Avatar with 6 size variants (xs–2xl)
    │       ├── badge.tsx              CVA badge — 6 semantic variants + asChild
    │       ├── button.tsx             CVA button — 6 variants
    │       ├── divider-or.tsx         Auth form "Or" divider
    │       ├── form.tsx               React Hook Form integration (Field/Item/Label/Control/Message)
    │       ├── image-carousel.tsx     Swipe + arrows + dots + keyboard
    │       ├── input-group.tsx        Advanced input composition
    │       ├── loading-button.tsx     Button + loading spinner + loadingText
    │       ├── pagination.tsx         Smart range algorithm + PaginationInfo + PageSizeSelector
    │       ├── password-input.tsx     Show/hide toggle
    │       ├── portal.tsx             SSR-safe React portal
    │       ├── resend-otp-button.tsx  Cooldown timer (localStorage)
    │       ├── skeleton.tsx           Shimmer gradient skeleton
    │       ├── social-login-button.tsx Generic OAuth button
    │       ├── toast.tsx              CVA toast with dot + action
    │       └── toaster.tsx            Imperative toast manager
    │
    ├── hooks/                        14 standalone hooks
    │   ├── useAutoRefresh.ts          Interval-based auto-refresh with toggle
    │   ├── useBeforeUnloadWarning.ts  "Leave site?" dialog
    │   ├── useDebounce.ts             Typed value debouncer
    │   ├── useDeviceSize.ts           Window dimensions (SSR-safe)
    │   ├── useFilters.ts              Filter + debounce + auto-fetch
    │   ├── useFocusTrap.ts            Tab/Shift+Tab wrapping
    │   ├── useFormShortcut.tsx         Ctrl/Cmd+Enter submit + hint
    │   ├── useIntersectionObserver.ts  Callback-ref pattern
    │   ├── useKeyboardShortcuts.ts    Declarative shortcuts
    │   ├── useOnlineStatus.ts         Online/offline + wasOffline
    │   ├── usePagination.ts           Pagination state machine
    │   ├── usePermissions.ts          Role hierarchy + permission checker
    │   ├── useReducedMotion.ts        prefers-reduced-motion
    │   └── useScrollSpy.ts            Section tracking for navs
    │
    ├── lib/                          11 utility modules
    │   ├── audio.ts                   Web Audio API programmatic sounds (6 effects + vibrate)
    │   ├── clipboard.ts               Copy-to-clipboard + Web Share API with fallback
    │   ├── confetti.ts                canvas-confetti presets (7 effects)
    │   ├── date-utils.ts              formatDate (7 styles) + formatShortTimeAgo + formatDateRange
    │   ├── design-system-rules.ts     Tailwind lint + token reference
    │   ├── error-utils.ts             ApiError class + message mapping + withErrorHandling HOF
    │   ├── layout-constants.ts        Z-index scale, sidebar/header/breakpoint tokens
    │   ├── motion.ts                  Framer Motion unified system
    │   ├── storage.ts                 Typed localStorage wrapper (SSR-safe, quota handling)
    │   ├── token-manager.ts           JWT decode + expiry + centralized refresh queue
    │   └── utils.ts                   cn() + formatNumber + getInitials + truncate + capitalize + formatCurrency + buildQueryParams
    │
    ├── providers/                    3 context providers
    │   ├── AuthProvider.tsx           Session validation + hydration gate
    │   ├── NetworkStatusProvider.tsx   Online/offline detection with debounce
    │   └── TokenRefreshProvider.tsx    Proactive JWT refresh scheduling + tab-return refresh
    │
    ├── store/                        2 Zustand store templates
    │   ├── notification-store-template.ts  Notification state with optimistic mark-read + polling
    │   └── ui-store-template.ts            Sidebar/drawer/command palette/page transition state
    │
    ├── configs/                      2 templates
    │   ├── apis-template.ts           Axios instance + interceptors + 401 refresh-retry + endpoint registry
    │   └── routes-template.ts         Route definition template
    │
    └── styling/
        └── globals.css               OKLCH colors + dark mode + keyframes + layout utilities
```

---

## Philosophy

- **Single purpose** — Every file does one thing well
- **Zero opinions** — No routing, no state management, no API layer
- **Copy-paste ready** — Self-contained or deps documented in header
- **Framework-flexible** — Works with Next.js, Vite, or plain React
- **Accessibility first** — ARIA, focus traps, keyboard nav, reduced motion

---

## Quick Start

1. Browse the folder that matches your need
2. Copy the file(s) into your project
3. Install any noted dependencies (file headers list them)
4. Wire `@/` alias or swap to relative imports

---

## Dependency Matrix

| Dependency | Install | Used By |
|-----------|---------|---------|
| `framer-motion` | `npm i framer-motion` | motion.ts, PageTransition, StaggerAnimation, animated-button, animated-counter, animated-tabs, image-carousel |
| `clsx` + `tailwind-merge` | `npm i clsx tailwind-merge` | utils.ts → most components |
| `class-variance-authority` | `npm i class-variance-authority` | button, toast, animated-button, badge, avatar |
| `lucide-react` | `npm i lucide-react` | ImageLightbox, StarRating, image-carousel, OfflineBanner, password-input, PageLoading, loading-button, pagination, AuthRequiredModal |
| `canvas-confetti` | `npm i canvas-confetti` | confetti.ts |
| `swiper` | `npm i swiper` | ProductCarousel |
| `lottie-react` | `npm i lottie-react` | LottieAnimation |
| `axios` | `npm i axios` | apis-template.ts |
| `zustand` | `npm i zustand` | ui-store-template, notification-store-template |
| `react-hook-form` | `npm i react-hook-form` | form.tsx |
| `@radix-ui/react-avatar` | `npm i @radix-ui/react-avatar` | avatar.tsx |
| `@radix-ui/react-label` | `npm i @radix-ui/react-label` | form.tsx |
| `@radix-ui/react-slot` | `npm i @radix-ui/react-slot` | button, badge, form.tsx |

### Zero-dependency (standalone)

Copy and use immediately — no installs needed:

- All 14 hooks
- ErrorBoundary, EmptyState, ErrorState, ConfirmDialog, PageLoading, OverlayLoader, TopLoadingBar
- lib/audio.ts, lib/clipboard.ts, lib/storage.ts, lib/date-utils.ts, lib/error-utils.ts, lib/token-manager.ts
- providers/AuthProvider, providers/NetworkStatusProvider, providers/TokenRefreshProvider
- divider-or, social-login-button, resend-otp-button
- design-system-rules.ts

---

## Rules

- Nothing project-specific lives here
- No API contracts, no app pages, no business logic
- Every file should be slap-and-go with minor edits
- If it can't serve 3+ projects, it doesn't belong
