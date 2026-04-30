import { useEffect, useState } from 'react'

/**
 * Detect if the user prefers reduced motion.
 * SSR-safe. Listens for live changes.
 *
 * Dependencies: React
 *
 * @returns true if user prefers reduced motion
 *
 * @example
 * const prefersReducedMotion = useReducedMotion()
 * <motion.div animate={prefersReducedMotion ? {} : { scale: 1.2 }} />
 */
export function useReducedMotion(): boolean {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)

		const listener = (event: MediaQueryListEvent) => {
			setPrefersReducedMotion(event.matches)
		}

		mediaQuery.addEventListener('change', listener)
		return () => mediaQuery.removeEventListener('change', listener)
	}, [])

	return prefersReducedMotion
}
