'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * WelcomeSection — Personalized greeting with time-of-day awareness and CTAs.
 *
 * Stolen from: Bookverse WelcomeSection — time-aware greeting, returning user detection,
 * avatar display, and horizontal CTA action cards.
 *
 * Features:
 * - Time-of-day greeting (morning/afternoon/evening)
 * - Optional returning user detection (localStorage)
 * - Avatar + personalized name
 * - Horizontal CTA cards with icons
 * - Responsive: full-width on mobile, constrained on desktop
 *
 * Dependencies: cn(), getGreeting() (included)
 *
 * @example
 * <WelcomeSection
 *   name="John"
 *   avatarUrl="/avatars/john.jpg"
 *   subtitle="Ready for your next read?"
 *   actions={[
 *     { icon: <Compass className="size-5" />, label: 'Explore', description: 'Browse new arrivals', href: '/explore' },
 *     { icon: <Heart className="size-5" />, label: 'Favorites', description: 'Your saved items', href: '/favorites' },
 *   ]}
 * />
 */

/** Returns a time-of-day greeting. Reusable in any context. */
export function getGreeting(): string {
	const hour = new Date().getHours()
	if (hour < 12) return 'Good morning'
	if (hour < 17) return 'Good afternoon'
	return 'Good evening'
}

interface WelcomeAction {
	icon: ReactNode
	label: string
	description?: string
	href: string
}

interface WelcomeSectionProps {
	/** User's display name */
	name?: string
	/** Avatar URL */
	avatarUrl?: string
	/** Text below the greeting */
	subtitle?: string
	/** Horizontal CTA cards */
	actions?: WelcomeAction[]
	/** Custom link component */
	linkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }>
	className?: string
}

export function WelcomeSection({
	name,
	avatarUrl,
	subtitle,
	actions = [],
	linkComponent: LinkComp = 'a' as unknown as React.ComponentType<{ href: string; className?: string; children: ReactNode }>,
	className,
}: WelcomeSectionProps) {
	const greeting = getGreeting()

	return (
		<section className={cn('space-y-6', className)}>
			{/* Greeting row */}
			<div className='flex items-center gap-4'>
				{avatarUrl && (
					<div className='size-12 shrink-0 overflow-hidden rounded-full bg-muted'>
						<img
							src={avatarUrl}
							alt={name ?? 'User'}
							className='size-full object-cover'
						/>
					</div>
				)}

				<div>
					<h2 className='text-2xl font-bold text-foreground md:text-3xl'>
						{greeting}{name ? `, ${name}` : ''}
					</h2>
					{subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
				</div>
			</div>

			{/* Action cards */}
			{actions.length > 0 && (
				<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
					{actions.map(action => (
						<LinkComp
							key={action.href}
							href={action.href}
							className={cn(
								'flex items-center gap-3 rounded-xl border border-border bg-card p-4',
								'transition-all hover:border-primary/30 hover:shadow-sm',
							)}
						>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
								{action.icon}
							</div>

							<div className='min-w-0'>
								<div className='font-medium text-foreground'>{action.label}</div>
								{action.description && (
									<div className='text-xs text-muted-foreground'>{action.description}</div>
								)}
							</div>
						</LinkComp>
					))}
				</div>
			)}
		</section>
	)
}
