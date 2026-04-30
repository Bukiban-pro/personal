'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * StickyHeader — Full-width sticky header with backdrop blur.
 *
 * Stolen from: Bookverse home layout header — sticky, blurred, bordered.
 *
 * Features:
 * - sticky top-0 with z-index
 * - Backdrop blur for glass morphism
 * - Slots: left (logo/back), center (search/nav), right (actions)
 * - Responsive: center slot hidden on mobile unless forced
 *
 * Dependencies: cn()
 *
 * @example
 * <StickyHeader
 *   left={<Logo />}
 *   center={<SearchBar />}
 *   right={<UserMenu />}
 * />
 */

interface StickyHeaderProps {
	left?: ReactNode
	center?: ReactNode
	right?: ReactNode
	/** Show center slot on mobile too. Default: false */
	centerOnMobile?: boolean
	/** Height class. Default: 'h-16' */
	height?: string
	className?: string
}

export function StickyHeader({
	left,
	center,
	right,
	centerOnMobile = false,
	height = 'h-16',
	className,
}: StickyHeaderProps) {
	return (
		<header
			className={cn(
				'sticky top-0 z-30 w-full shrink-0 border-b border-border bg-background/95 backdrop-blur-md',
				height,
				className,
			)}
			role='banner'
		>
			<div className='mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6'>
				{/* Left slot */}
				<div className='flex shrink-0 items-center gap-3'>{left}</div>

				{/* Center slot */}
				{center && (
					<div className={cn('flex-1', !centerOnMobile && 'hidden sm:block')}>
						{center}
					</div>
				)}

				{/* Right slot */}
				<div className='flex shrink-0 items-center gap-2'>{right}</div>
			</div>
		</header>
	)
}
