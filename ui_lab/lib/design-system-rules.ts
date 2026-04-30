/**
 * Design System Rules — Lint-time enforcement for Tailwind design tokens.
 *
 * Use with ESLint no-restricted-syntax or a custom code review script.
 * Adapt the ALLOWED_TOKENS to your project's tailwind.config.
 *
 * No runtime dependencies. Import statically for tooling.
 */

// ================================
// Forbidden arbitrary-value patterns
// ================================

export const FORBIDDEN_PATTERNS = {
	arbitraryWidth: /w-\[\d+px\]/,
	arbitraryHeight: /h-\[\d+px\]/,
	arbitraryText: /text-\[\d+px\]/,
	arbitraryGap: /gap-\[\d+px\]/,
	arbitraryPadding: /p[xytblr]?-\[\d+px\]/,
	arbitraryMargin: /m[xytblr]?-\[\d+px\]/,
	arbitraryColor: /(bg|text|border)-\[#[0-9a-fA-F]+\]/,
	/** h-4 w-4 → use size-4 instead */
	legacySize: /\b(h|w)-\d+\s+(h|w)-\d+\b/,
	/** z-50 etc → use semantic z-index tokens */
	hardcodedZIndex: /z-\d{2,}/,
}

// ================================
// Allowed token reference (adapt to your tailwind.config)
// ================================

export const ALLOWED_TOKENS = {
	/** max-w-container-<size> — page containers */
	containerWidths: [
		'max-w-container-sm',   // ~480px
		'max-w-container-md',   // ~600px
		'max-w-container-lg',   // ~800px
		'max-w-container-xl',   // ~1000px
		'max-w-container-form', // ~900px
	],

	/** Fixed layout widths — sidebar, right panel, drawers */
	layoutWidths: [
		'w-nav',    // sidebar (~80px)
		'w-right',  // right panel (~280px)
		'w-drawer', // drawer (~400px)
	],

	/** size-* for square icons (use instead of separate h-/w-) */
	iconSizes: [
		'size-4',       // 16px — inline icons
		'size-5',       // 20px — button icons
		'size-6',       // 24px — standard icons
		'size-8',       // 32px — large icons
		'size-10',      // 40px — xl icons
		'size-12',      // 48px — 2xl icons
		'size-icon-sm', // 18px — semantic
		'size-icon-md', // 22px
		'size-icon-lg', // 28px
		'size-icon-xl', // 32px
	],

	/** Avatar sizes — semantic tokens */
	avatarSizes: [
		'size-avatar-xs', // 32px
		'size-avatar-sm', // 42px
		'size-avatar-md', // 72px
		'size-avatar-lg', // 100px
		'size-avatar-xl', // 120px
	],

	/** Standard Tailwind spacing — no arbitrary values */
	spacing: [
		'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10', 'gap-12',
		'gap-xs', 'gap-sm', 'gap-md', 'gap-lg', 'gap-xl', 'gap-2xl', 'gap-3xl',
		'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12',
		'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12',
	],

	/** Text sizes — semantic + standard */
	textSizes: [
		'text-2xs', 'text-xs', 'text-sm', 'text-caption', 'text-label',
		'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
	],

	/** Background colors — semantic tokens only */
	backgrounds: [
		'bg-background', 'bg-card', 'bg-muted', 'bg-accent',
		'bg-primary', 'bg-secondary', 'bg-destructive',
		'bg-popover',
	],

	/** Text colors — semantic tokens only */
	textColors: [
		'text-foreground', 'text-muted-foreground', 'text-primary',
		'text-secondary-foreground', 'text-accent-foreground',
		'text-destructive',
	],

	/** Border colors */
	borderColors: ['border-border', 'border-input', 'border-ring'],

	/** Z-index — semantic layers */
	zIndex: [
		'z-base',         // 0 — default stacking
		'z-dropdown',     // 10 — dropdowns, popovers
		'z-sticky',       // 20 — sticky headers, floating buttons
		'z-modal',        // 30 — modals, dialogs
		'z-notification', // 40 — toasts, banners
		'z-tooltip',      // 50 — tooltips (topmost)
	],

	/** Shadows — use shadow tokens, not arbitrary box-shadow */
	shadows: ['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-card', 'shadow-warm', 'shadow-glow'],

	/** Border radius — design system tokens */
	borderRadius: ['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'],
}

// ================================
// Motion presets reference
// ================================

export const MOTION_PRESETS = {
	transitions: ['TRANSITION_SPRING', 'TRANSITION_SMOOTH', 'TRANSITION_BOUNCY'],
	hovers: [
		'BUTTON_HOVER', 'BUTTON_SUBTLE_HOVER',
		'CARD_HOVER', 'CARD_FEED_HOVER', 'CARD_GRID_HOVER',
		'ICON_BUTTON_HOVER', 'IMAGE_ZOOM_HOVER', 'LIST_ITEM_HOVER',
	],
	taps: ['BUTTON_TAP', 'BUTTON_SUBTLE_TAP', 'ICON_BUTTON_TAP', 'LIST_ITEM_TAP'],
	animations: [
		'staggerContainer', 'staggerItem',
		'FADE_IN_VARIANTS', 'SCALE_IN_VARIANTS', 'SLIDE_IN_VARIANTS',
	],
}

// ================================
// Dev console warnings
// ================================

export const DEV_WARNINGS = {
	arbitraryValue: (value: string) =>
		`⚠️ DESIGN SYSTEM: Arbitrary value "${value}" detected. Use a design token instead.`,

	legacyPattern: (pattern: string) =>
		`⚠️ DESIGN SYSTEM: Legacy pattern "${pattern}" detected. Use size-* utility.`,

	missingPageWrapper: (page: string) =>
		`⚠️ DESIGN SYSTEM: Page "${page}" missing transition wrapper.`,
}

/** Convenience aggregate */
export const DesignSystemRules = {
	FORBIDDEN_PATTERNS,
	ALLOWED_TOKENS,
	MOTION_PRESETS,
	DEV_WARNINGS,
}
