'use client'

import { useEffect, useRef, useState, ReactNode, startTransition } from 'react'

/**
 * LazySection — Defer rendering until component nears the viewport.
 *
 * EXTREME OPTIMIZATION:
 * - IntersectionObserver for viewport detection
 * - startTransition for non-blocking rendering
 * - requestIdleCallback for high-priority prefetch during idle time
 * - Once visible → always rendered (no unmount on scroll-away)
 *
 * Use for below-the-fold content that triggers API calls.
 * Prevents thundering herd of requests on page load.
 *
 * Dependencies: React 18+ (startTransition)
 *
 * @example
 * <LazySection placeholderHeight="400px" priority="high">
 *   <RecommendationsSection />
 * </LazySection>
 *
 * <LazySection eager>
 *   <HeroSection /> {/* Above the fold — render immediately */}
 * </LazySection>
 */

interface LazySectionProps {
	children: ReactNode
	/** Height of placeholder to prevent layout shift */
	placeholderHeight?: string
	/** IntersectionObserver rootMargin (load before visible) */
	rootMargin?: string
	/** Custom skeleton to show while not visible */
	skeleton?: ReactNode
	/** Skip lazy loading (e.g. above-the-fold content) */
	eager?: boolean
	/** 'high' = requestIdleCallback prefetch, 'low' = wait for visibility */
	priority?: 'high' | 'low'
}

export function LazySection({
	children,
	placeholderHeight = '200px',
	rootMargin = '100px',
	skeleton,
	eager = false,
	priority = 'low',
}: LazySectionProps) {
	const [hasBeenVisible, setHasBeenVisible] = useState(eager)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (eager || hasBeenVisible) return

		// HIGH PRIORITY: Load during browser idle time
		if (priority === 'high' && typeof requestIdleCallback !== 'undefined') {
			const idleId = requestIdleCallback(
				() => startTransition(() => setHasBeenVisible(true)),
				{ timeout: 2000 },
			)
			return () => cancelIdleCallback(idleId)
		}

		// LOW PRIORITY: Standard viewport observation
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					startTransition(() => setHasBeenVisible(true))
					observer.disconnect()
				}
			},
			{ rootMargin },
		)

		if (ref.current) observer.observe(ref.current)
		return () => observer.disconnect()
	}, [rootMargin, eager, hasBeenVisible, priority])

	if (hasBeenVisible) return <>{children}</>

	return (
		<div ref={ref} style={{ minHeight: placeholderHeight }}>
			{skeleton || (
				<div className='space-y-4 animate-pulse'>
					<div className='h-6 w-48 rounded bg-muted/30' />
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='h-48 rounded-lg bg-muted/20' />
						))}
					</div>
				</div>
			)}
		</div>
	)
}

/**
 * Generic grid skeleton — for any content section with header.
 */
export function GridSkeleton({ cardCount = 4 }: { cardCount?: number }) {
	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-3'>
				<div className='w-1 h-6 rounded-full bg-muted/30' />
				<div className='h-6 w-40 rounded bg-muted/30' />
			</div>
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				{Array.from({ length: cardCount }).map((_, i) => (
					<div key={i} className='space-y-2'>
						<div className='aspect-[2/3] rounded-lg bg-muted/20' />
						<div className='h-4 w-3/4 rounded bg-muted/20' />
						<div className='h-3 w-1/2 rounded bg-muted/20' />
					</div>
				))}
			</div>
		</div>
	)
}
