import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * PageContainer — Constrained-width wrapper for page content.
 *
 * Stolen from: Chefkix PageContainer — the "content lane" that prevents
 * ultra-wide sprawl on big monitors while centering content.
 *
 * Dependencies: cn()
 *
 * @example
 * <PageContainer maxWidth="lg">
 *   <h1>Dashboard</h1>
 *   <StatsGrid ... />
 * </PageContainer>
 *
 * @example
 * <PageContainer maxWidth="sm"> // Tight, focused content (forms, articles)
 *   <SettingsForm />
 * </PageContainer>
 */

interface PageContainerProps {
	children: ReactNode
	/**
	 * Content width preset:
	 * - 'xs':   max-w-lg     (512px)  — single-column forms, confirmations
	 * - 'sm':   max-w-xl     (576px)  — auth forms, narrow content
	 * - 'md':   max-w-2xl    (672px)  — articles, reading-width content
	 * - 'lg':   max-w-4xl    (896px)  — social feed, dashboard
	 * - 'xl':   max-w-6xl    (1152px) — wide dashboards, data tables
	 * - '2xl':  max-w-7xl    (1280px) — full marketing pages
	 * - 'full': max-w-full             — no constraint
	 */
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
	/** Center the container. Default: true */
	center?: boolean
	className?: string
}

const maxWidthClasses = {
	xs: 'max-w-lg',
	sm: 'max-w-xl',
	md: 'max-w-2xl',
	lg: 'max-w-4xl',
	xl: 'max-w-6xl',
	'2xl': 'max-w-7xl',
	full: 'max-w-full',
} as const

export function PageContainer({
	children,
	maxWidth = 'lg',
	center = true,
	className,
}: PageContainerProps) {
	return (
		<div className={cn('w-full', maxWidthClasses[maxWidth], center && 'mx-auto', className)}>
			{children}
		</div>
	)
}
