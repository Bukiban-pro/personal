'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, ReactNode } from 'react'
import { PAGE_VARIANTS, DURATIONS, EASINGS } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * PageTransition — AnimatePresence wrapper for route changes.
 *
 * Features:
 * - Skips animation on first mount (no flash)
 * - Respects prefers-reduced-motion
 * - Uses AnimatePresence mode='wait' for proper exit → enter sequencing
 *
 * Dependencies: framer-motion, motion.ts, utils.ts
 *
 * Usage:
 *   // Next.js: wrap children in layout.tsx
 *   <PageTransition>{children}</PageTransition>
 *
 *   // React Router: key on location
 *   <PageTransition key={location.pathname}>{children}</PageTransition>
 *
 * For non-Next.js: replace usePathname() with your router's location key,
 * or pass a `routeKey` prop directly.
 */

interface PageTransitionProps {
	children: ReactNode
	className?: string
	/** Unique key per route. Defaults to window.location.pathname in useEffect. */
	routeKey?: string
}

export function PageTransition({ children, className, routeKey }: PageTransitionProps) {
	const isFirstMount = useRef(true)
	const prefersReducedMotion = useReducedMotion()

	useEffect(() => {
		isFirstMount.current = false
	}, [])

	const variants =
		prefersReducedMotion
			? { initial: {}, animate: {}, exit: {} }
			: isFirstMount.current
				? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }
				: PAGE_VARIANTS

	return (
		<AnimatePresence mode='wait'>
			<motion.div
				key={routeKey}
				className={cn(className)}
				initial={variants.initial}
				animate={variants.animate}
				exit={variants.exit}
				transition={{
					duration: DURATIONS.smooth / 1000,
					ease: EASINGS.smooth,
					opacity: { duration: DURATIONS.fast / 1000 },
				}}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}
