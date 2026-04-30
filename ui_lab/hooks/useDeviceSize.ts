import { useState, useEffect } from 'react'

/**
 * Get current window dimensions. SSR-safe with sensible mobile defaults (375×667).
 *
 * Dependencies: React
 *
 * @returns [width, height]
 *
 * @example
 * const [width, height] = useDeviceSize()
 * const isMobile = width < 768
 */
export function useDeviceSize(): [number, number] {
	const [size, setSize] = useState<[number, number]>(() => {
		if (typeof window !== 'undefined') {
			return [window.innerWidth, window.innerHeight]
		}
		return [375, 667] // Safe mobile default for SSR
	})

	useEffect(() => {
		const updateSize = () => setSize([window.innerWidth, window.innerHeight])
		updateSize()
		window.addEventListener('resize', updateSize)
		return () => window.removeEventListener('resize', updateSize)
	}, [])

	return size
}
