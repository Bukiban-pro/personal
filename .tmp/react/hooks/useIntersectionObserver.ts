import { useEffect, useRef, useCallback } from 'react'

/**
 * IntersectionObserver hook — callback-ref pattern (no useRef needed at call site).
 * Perfect for infinite scroll, lazy loading, and view-triggered animations.
 *
 * Dependencies: React
 *
 * @param callback - Called when observed element enters viewport
 * @param options - IntersectionObserver options
 * @returns Callback ref to attach to the sentinel element
 *
 * @example
 * const sentinelRef = useIntersectionObserver(
 *   () => fetchNextPage(),
 *   { enabled: hasNextPage, rootMargin: '200px' }
 * )
 * return <div ref={sentinelRef} />
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
	callback: () => void,
	options: {
		enabled?: boolean
		threshold?: number
		rootMargin?: string
	} = {}
) {
	const { enabled = true, threshold = 0, rootMargin = '100px' } = options
	const observerRef = useRef<IntersectionObserver | null>(null)

	const setRef = useCallback((node: T | null) => {
		if (observerRef.current) {
			observerRef.current.disconnect()
			observerRef.current = null
		}

		if (!node || !enabled) return

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) callback()
			},
			{ threshold, rootMargin }
		)
		observerRef.current.observe(node)
	}, [callback, enabled, threshold, rootMargin])

	useEffect(() => {
		return () => observerRef.current?.disconnect()
	}, [])

	return setRef
}
