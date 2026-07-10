# UI Lab Grouped Access Layer

This folder is generated. It provides grouped entrypoints over the component source tree and keeps the shelf taxonomy consumable from one place.

- Repo guide: `projects/ui-patterns/docs/UI_LAB_LIBRARY_GUIDE.md`
- LandingProduct guide: `projects/ui-patterns/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md`
- Root grouped barrel: `projects/ui-patterns/library/index.ts`
- By-name barrel: `projects/ui-patterns/library/by-name/index.ts`
- Component index: `projects/ui-patterns/library/component-index.json`
- Shelf exact-component barrels: `projects/ui-patterns/library/shelves/*/components.ts`
- Starter-lane exact-component barrels: `projects/ui-patterns/library/starter-lanes/*/components.ts`
- Shelf metadata files: `projects/ui-patterns/library/shelves/*/meta.json`
- Starter-lane metadata files: `projects/ui-patterns/library/starter-lanes/*/meta.json`

## Lookup
- Use `projects/ui-patterns/library/by-name` when you know the component filename but not its shelf.
- Use `projects/ui-patterns/library/component-index.json` for machine-readable lookup by name, shelf, and starter-lane membership.
- Use `components.ts` inside a shelf or starter lane when you want exact file-name exports only, without helper exports.
- Use `meta.json` inside a shelf or starter lane when you want folder-local machine-readable metadata.

## Shelves
- `LandingProduct System`: `projects/ui-patterns/library/shelves/landing-product-system`
- `Landing and Marketing`: `projects/ui-patterns/library/shelves/landing-marketing`
- `Data and Admin`: `projects/ui-patterns/library/shelves/data-admin`
- `Forms and Authoring`: `projects/ui-patterns/library/shelves/forms-authoring`
- `Feedback and State`: `projects/ui-patterns/library/shelves/feedback-state`
- `UI Primitives`: `projects/ui-patterns/library/shelves/ui-primitives`
- `Navigation and Command`: `projects/ui-patterns/library/shelves/navigation-command`
- `Motion and Typography`: `projects/ui-patterns/library/shelves/motion-typography`
- `Backgrounds and Effects`: `projects/ui-patterns/library/shelves/backgrounds-effects`
- `Interactive Showcase`: `projects/ui-patterns/library/shelves/interactive-showcase`
- `Misc and Uncurated`: `projects/ui-patterns/library/shelves/misc-uncurated`

## Starter Lanes
- `Marketing Quickstart`: `projects/ui-patterns/library/starter-lanes/marketing-quickstart`
- `Dashboard Core`: `projects/ui-patterns/library/starter-lanes/dashboard-core`
- `Forms and Operations`: `projects/ui-patterns/library/starter-lanes/forms-operations`
- `Polish Layer`: `projects/ui-patterns/library/starter-lanes/polish-layer`
