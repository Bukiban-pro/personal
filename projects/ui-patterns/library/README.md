# UI Lab Grouped Access Layer

This folder is generated. It provides grouped entrypoints over the component source tree and keeps the shelf taxonomy consumable from one place.

- Repo guide: `ui_lab/docs/UI_LAB_LIBRARY_GUIDE.md`
- LandingProduct guide: `ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md`
- Root grouped barrel: `ui_lab/library/index.ts`
- By-name barrel: `ui_lab/library/by-name/index.ts`
- Component index: `ui_lab/library/component-index.json`
- Shelf exact-component barrels: `ui_lab/library/shelves/*/components.ts`
- Starter-lane exact-component barrels: `ui_lab/library/starter-lanes/*/components.ts`
- Shelf metadata files: `ui_lab/library/shelves/*/meta.json`
- Starter-lane metadata files: `ui_lab/library/starter-lanes/*/meta.json`

## Lookup
- Use `ui_lab/library/by-name` when you know the component filename but not its shelf.
- Use `ui_lab/library/component-index.json` for machine-readable lookup by name, shelf, and starter-lane membership.
- Use `components.ts` inside a shelf or starter lane when you want exact file-name exports only, without helper exports.
- Use `meta.json` inside a shelf or starter lane when you want folder-local machine-readable metadata.

## Shelves
- `LandingProduct System`: `ui_lab/library/shelves/landing-product-system`
- `Landing and Marketing`: `ui_lab/library/shelves/landing-marketing`
- `Data and Admin`: `ui_lab/library/shelves/data-admin`
- `Forms and Authoring`: `ui_lab/library/shelves/forms-authoring`
- `Feedback and State`: `ui_lab/library/shelves/feedback-state`
- `UI Primitives`: `ui_lab/library/shelves/ui-primitives`
- `Navigation and Command`: `ui_lab/library/shelves/navigation-command`
- `Motion and Typography`: `ui_lab/library/shelves/motion-typography`
- `Backgrounds and Effects`: `ui_lab/library/shelves/backgrounds-effects`
- `Interactive Showcase`: `ui_lab/library/shelves/interactive-showcase`
- `Misc and Uncurated`: `ui_lab/library/shelves/misc-uncurated`

## Starter Lanes
- `Marketing Quickstart`: `ui_lab/library/starter-lanes/marketing-quickstart`
- `Dashboard Core`: `ui_lab/library/starter-lanes/dashboard-core`
- `Forms and Operations`: `ui_lab/library/starter-lanes/forms-operations`
- `Polish Layer`: `ui_lab/library/starter-lanes/polish-layer`
