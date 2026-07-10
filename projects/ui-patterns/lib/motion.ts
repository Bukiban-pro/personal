/**
 * Unified Motion System
 * Single source of truth for all animations — makes the app "breathe with the same lungs."
 *
 * Dependencies: framer-motion
 *
 * Usage: import { SPRING, FADE_IN_VARIANTS, BUTTON_HOVER } from '@/lib/motion'
 */

// ============================================
// SPRING PHYSICS
// ============================================

export const SPRING = {
	stiffness: 400,
	damping: 17,
	mass: 0.5,
} as const

export const SPRING_SMOOTH = {
	stiffness: 300,
	damping: 20,
	mass: 0.8,
} as const

export const SPRING_BOUNCY = {
	stiffness: 500,
	damping: 15,
	mass: 0.3,
} as const

// ============================================
// DURATION CONSTANTS (milliseconds)
// ============================================

export const DURATIONS = {
	instant: 75,
	fast: 150,
	normal: 200,
	smooth: 300,
	slow: 500,
	verySlow: 700,
} as const

// ============================================
// EASING FUNCTIONS (cubic-bezier arrays for Framer Motion)
// ============================================

export const EASINGS = {
	bounce: [0.68, -0.55, 0.265, 1.55],
	smooth: [0.25, 0.8, 0.25, 1],
	sharp: [0.4, 0, 0.2, 1],
	ease: [0.4, 0, 0.6, 1],
} as const

// ============================================
// COMMON ANIMATION VARIANTS
// ============================================

export const FADE_IN_VARIANTS = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
} as const

export const SCALE_IN_VARIANTS = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: { opacity: 1, scale: 1 },
} as const

export const SLIDE_IN_VARIANTS = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0 },
} as const

// ============================================
// STAGGER CONFIGURATION (for list/grid animations)
// ============================================

export const STAGGER_CONFIG = {
	fast: 0.03,
	normal: 0.05,
	slow: 0.1,
} as const

// ============================================
// HOVER / TAP STATES (interactive elements)
// ============================================

// Primary buttons
export const BUTTON_HOVER = { scale: 1.05, y: -2 } as const
export const BUTTON_TAP = { scale: 0.98, y: 0 } as const

// Secondary/subtle buttons
export const BUTTON_SUBTLE_HOVER = { scale: 1.05 } as const
export const BUTTON_SUBTLE_TAP = { scale: 0.95 } as const

// Cards
export const CARD_HOVER = { scale: 1.02, y: -4 } as const
export const CARD_FEED_HOVER = { y: -4 } as const
export const CARD_GRID_HOVER = { y: -6 } as const
export const CARD_FEATURED_HOVER = { scale: 1.01 } as const

// List items
export const LIST_ITEM_HOVER = { scale: 1.02 } as const
export const LIST_ITEM_TAP = { scale: 0.98 } as const

// Images (zoom on hover inside cards)
export const IMAGE_ZOOM_HOVER = { scale: 1.05 } as const
export const IMAGE_ZOOM_LARGE_HOVER = { scale: 1.08 } as const

// Icons
export const ICON_HOVER = { scale: 1.1, rotate: 5 } as const
export const ICON_BUTTON_HOVER = { scale: 1.1 } as const
export const ICON_BUTTON_TAP = { scale: 0.95 } as const

// Stats / data items
export const STAT_ITEM_HOVER = { y: -2 } as const

// ============================================
// TRANSITION PRESETS
// ============================================

export const TRANSITION_SPRING = { type: 'spring' as const, ...SPRING }
export const TRANSITION_SMOOTH = { type: 'spring' as const, ...SPRING_SMOOTH }
export const TRANSITION_BOUNCY = { type: 'spring' as const, ...SPRING_BOUNCY }

// Shared element / layout animations
export const LAYOUT_TRANSITION = {
	type: 'spring' as const,
	stiffness: 350,
	damping: 25,
}

// ============================================
// PAGE / ROUTE TRANSITIONS
// ============================================

export const PAGE_VARIANTS = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -10 },
}

export const PAGE_TRANSITION = {
	duration: DURATIONS.smooth / 1000,
	ease: EASINGS.smooth,
}

// ============================================
// STEP / WIZARD TRANSITIONS
// Forward motion = slide left, backward = slide right
// ============================================

export const STEP_VARIANTS = {
	initial: { opacity: 0, x: 20 },
	animate: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: -20 },
}

export const STEP_TRANSITION = {
	duration: DURATIONS.normal / 1000,
	ease: EASINGS.smooth,
}

// ============================================
// CONTENT SWITCH (tabs, toggles — subtle in-place swap)
// ============================================

export const CONTENT_SWITCH_VARIANTS = {
	initial: { opacity: 0, y: 8, scale: 0.98 },
	animate: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: -8, scale: 0.98 },
}

export const CONTENT_SWITCH_TRANSITION = {
	duration: DURATIONS.fast / 1000,
	ease: EASINGS.smooth,
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate stagger transition for list items
 * @param index - Item index in list
 * @param stagger - Delay between items (use STAGGER_CONFIG values)
 */
export const getStaggerTransition = (
	index: number,
	stagger: number = STAGGER_CONFIG.normal,
) => ({
	...TRANSITION_SPRING,
	delay: index * stagger,
})

/**
 * Orchestrated hover variants (parent-child cascade)
 * Use with Framer Motion's whileHover="hover" on parent
 */
export const ORCHESTRATED_HOVER = {
	hover: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0,
		},
	},
}

// ============================================
// EXIT STATES
// ============================================

export const EXIT_VARIANTS = {
	fadeOut: { opacity: 0 },
	scaleOut: { opacity: 0, scale: 0.8 },
	slideOut: { opacity: 0, x: -20 },
	/** For list items in popLayout — exit without leaving blank space */
	listItemExit: { opacity: 0, scale: 0.95, height: 0, marginBottom: 0 },
}

// ============================================
// OVERLAY / BACKDROP
// ============================================

export const OVERLAY_BACKDROP = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.2 } },
	exit: { opacity: 0, transition: { duration: 0.15 } },
}

// ============================================
// MODAL ENTRANCE (celebration / success modals)
// ============================================

export const MODAL_ENTRANCE = {
	hidden: { scale: 0.5, opacity: 0, y: 50 },
	visible: {
		scale: 1,
		opacity: 1,
		y: 0,
		transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
	},
	exit: {
		scale: 0.9,
		opacity: 0,
		y: -20,
		transition: { duration: 0.2 },
	},
}

// ============================================
// GLOW PULSE (attention ring — use CSS var for color)
// ============================================

export const GLOW_PULSE = {
	animate: {
		boxShadow: [
			'0 0 20px var(--glow-color, rgba(99, 102, 241, 0.3))',
			'0 0 35px var(--glow-color, rgba(99, 102, 241, 0.5))',
			'0 0 20px var(--glow-color, rgba(99, 102, 241, 0.3))',
		],
		transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
	},
}

// ============================================
// PULSE RING (floating action buttons)
// ============================================

export const PULSE_RING = {
	animate: {
		scale: [1, 1.05, 1],
		boxShadow: [
			'0 0 0 0 rgba(99, 102, 241, 0.4)',
			'0 0 0 10px rgba(99, 102, 241, 0)',
			'0 0 0 0 rgba(99, 102, 241, 0)',
		],
		transition: { duration: 2, repeat: Infinity, ease: 'easeOut' as const },
	},
}

// ============================================
// PROGRESS BAR FILL
// ============================================

export const PROGRESS_FILL = {
	initial: { scaleX: 0, originX: 0 },
	animate: (width: number) => ({
		scaleX: width / 100,
		transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.3 },
	}),
}

// ============================================
// URGENT PULSE (timers, deadlines)
// ============================================

export const URGENT_PULSE = {
	animate: {
		scale: [1, 1.05, 1],
		transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const },
	},
}

// ============================================
// STEP DOTS (wizard progress indicators)
// ============================================

export const STEP_DOT = {
	inactive: { scale: 1, backgroundColor: 'var(--border-color)' },
	active: {
		scale: 1.2,
		backgroundColor: 'var(--color-primary)',
		transition: { type: 'spring' as const, stiffness: 500, damping: 25 },
	},
	completed: {
		scale: 1,
		backgroundColor: 'var(--color-success)',
	},
}

// ============================================
// FLOATING PARTICLE (celebration / ambient)
// ============================================

export const PARTICLE_FLOAT = {
	initial: { y: 0, opacity: 1, scale: 1 },
	animate: {
		y: -30,
		opacity: 0,
		scale: 0.5,
		transition: { duration: 1.5, ease: 'easeOut' },
	},
}

// ============================================
// STAGGER ANIMATION VARIANT PAIRS
// Ready-to-use with <motion.div variants={staggerContainer}>
// ============================================

export const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.05, delayChildren: 0.1 },
	},
}

export const staggerItem = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: TRANSITION_SPRING },
}

export const fadeInUp = staggerItem

export const scaleIn = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: { opacity: 1, scale: 1, transition: TRANSITION_SPRING },
}

// ============================================
// HAPTIC MICRO-INTERACTIONS
// Premium tactile feedback for common UI actions
// ============================================

/** Heart "pop" for like buttons (Instagram-style) */
export const HEART_POP = {
	initial: { scale: 1 },
	liked: {
		scale: [1, 1.3, 0.9, 1.1, 1],
		transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.7, 1], ease: 'easeOut' },
	},
	unliked: {
		scale: [1, 0.8, 1],
		transition: { duration: 0.2 },
	},
}

/** Bookmark/save slide animation */
export const BOOKMARK_SLIDE = {
	saved: {
		y: [0, -3, 0],
		scale: [1, 1.1, 1],
		transition: { duration: 0.3 },
	},
	unsaved: {
		y: [0, 2, 0],
		scale: [1, 0.95, 1],
		transition: { duration: 0.2 },
	},
}

/** Send button whoosh */
export const SEND_WHOOSH = {
	initial: { x: 0, opacity: 1 },
	sending: {
		x: [0, 10, -5, 0],
		opacity: [1, 0.5, 0.5, 1],
		transition: { duration: 0.3, times: [0, 0.3, 0.6, 1] },
	},
}

/** Notification bell shake */
export const BELL_SHAKE = {
	animate: {
		rotate: [0, 15, -15, 10, -10, 5, 0],
		transition: { duration: 0.5, ease: 'easeInOut' },
	},
}

/** Checkmark draw (SVG path animation) */
export const CHECKMARK_DRAW = {
	hidden: { pathLength: 0, opacity: 0 },
	visible: {
		pathLength: 1,
		opacity: 1,
		transition: {
			pathLength: { type: 'spring', duration: 0.5, bounce: 0 },
			opacity: { duration: 0.1 },
		},
	},
}
