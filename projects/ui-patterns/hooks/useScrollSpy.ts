import { useEffect, useState } from 'react'

/**
 * Track which section is currently in view as the user scrolls.
 * Useful for scroll-spy navigation, TOCs, and landing page indicators.
 *
 * Dependencies: React
 *
 * @param sectionIds - Array of DOM element IDs to track
 * @param offset - Pixels from top to trigger (default: 200)
 * @returns The ID of the currently active section
 *
 * @example
 * const activeId = useScrollSpy(['hero', 'features', 'pricing'], 200)
 * // Highlight the nav item whose id === activeId
 */
export function useScrollSpy(sectionIds: string[], offset = 200) {
	const [activeId, setActiveId] = useState(sectionIds[0])

	useEffect(() => {
		let rafId = 0

		const computeActive = () => {
			const scrollY = window.scrollY + offset

			for (let i = sectionIds.length - 1; i >= 0; i--) {
				const el = document.getElementById(sectionIds[i])
				if (el && el.offsetTop <= scrollY) {
					setActiveId(sectionIds[i])
					break
				}
			}
		}

		const handler = () => {
			cancelAnimationFrame(rafId)
			rafId = requestAnimationFrame(computeActive)
		}

		window.addEventListener('scroll', handler, { passive: true })
		computeActive()
		return () => {
			cancelAnimationFrame(rafId)
			window.removeEventListener('scroll', handler)
		}
	}, [sectionIds, offset])

	return activeId
}
