# General Design-System Notes

## Keep

### 1. Token-first styling
Avoid random one-off values when the style is structural or repeated.

Prefer:
- semantic colors
- spacing scale
- radius scale
- shadow scale
- motion presets

### 2. Accessibility defaults
Every reusable component should ship with:
- visible focus states
- disabled styling
- reduced-motion respect
- icon + text alignment
- keyboard-friendly behavior

### 3. State clarity
Reusable UI should always define:
- default
- hover
- focus
- active
- disabled
- invalid
- loading

### 4. Composition over specialization
Good stash pieces are primitives or lightly opinionated composites.

Best examples:
- button system
- input group
- loading button
- logo wrapper
- animation wrapper
- carousel shell

Avoid storing domain copy in reusable pieces.

## Reuse heuristics

A pattern is worth saving when it is:
1. visually solid
2. dependency-light
3. not tied to one product story
4. easy to rename or restyle
5. useful in at least 3 future screens

## Copy cleanup rule
Before stashing, strip out:
- product names
- market/category nouns
- brand slogans
- service endpoints that only fit one app
- roadmap or milestone language

## Practical defaults

### Buttons
- `default`
- `secondary`
- `outline`
- `ghost`
- `destructive`
- `link`

### Inputs
- icon left/right support
- inline actions
- group-wide focus ring
- invalid styles
- textarea compatibility

### Motion
- 150–300ms for common transitions
- transform/opacity over layout animation when possible
- full-motion fallback for users who allow it
- graceful reduced-motion mode

## What not to stash

Do not keep these in a personal UI kit:
- API contracts
- feature-complete app pages with product copy baked in
- one-off business rules
- sensitive environment config
- auth/business utilities unrelated to UI

---

## Layout Composition

The stash isn't just atoms — it captures page-level composition patterns too.

### Shell Hierarchy

```
AppShell        — 3-column authenticated shell (sidebar + content + right panel)
├── StickyHeader    — backdrop-blur glass header with 3 slots (left/center/right)
├── SidebarLayout   — collapsible sidebar with context provider + Ctrl+B
├── PageContainer   — constrained-width content wrapper (7 size presets)
└── MobileBottomNav — iOS-style bottom nav with elevated center CTA

PublicLayout    — header + flex-1 content + footer (for marketing/public pages)
AuthLayout      — centered card OR 50/50 split (for login/register)
Footer          — multi-column link grid with copyright bar
```

### Z-Index Discipline

| Layer         | Value | Usage                             |
|---------------|-------|-----------------------------------|
| `base`        | 0     | Default content                   |
| `dropdown`    | 10    | Dropdowns, popovers, tooltips     |
| `sticky`      | 20    | Sticky headers, sidebars          |
| `overlay`     | 30    | Overlays, backdrops               |
| `modal`       | 40    | Modal dialogs                     |
| `notification`| 50    | Toast notifications               |
| `tooltip`     | 60    | Tooltips above everything         |

Defined in both `layout-constants.ts` (JS) and `globals.css` (CSS utility classes).

### Section Rhythm

Pages follow a consistent vertical rhythm:
- **HeroSection** — Full-width gradient with blur orbs, badge, stats, CTAs
- **WelcomeSection** — Time-of-day greeting with personalized actions
- **StatsGrid** — Responsive 1→2→4 column stat cards
- Separator + content sections using `SECTION_SPACING` tokens

### Mobile-First Rules
- Bottom nav hidden at `md:` — desktop uses sidebar
- Sidebar collapses to icon rail on medium, overlay on mobile
- Center button in bottom nav is elevated `-mt-6` for thumb ergonomics
- All bottom nav uses `env(safe-area-inset-bottom)` for notched devices

