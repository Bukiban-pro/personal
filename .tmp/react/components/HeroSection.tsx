'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * HeroSection — Gradient hero banner with decorative blur orbs, badge, stats, and actions.
 *
 * Stolen from: Bookverse SearchHero — gradient hero with blur orbs, badge pill, gradient text,
 * mini-stat badges, and dual CTA buttons.
 *
 * Layout anatomy:
 * ┌──────────────────────────────────────────────────────┐
 * │  ● ● ●  blur orbs (decorative)                      │
 * │  ┌─────────────────────┬────────────────────┐        │
 * │  │ [Badge pill]        │                    │        │
 * │  │ Title line 1        │   Right slot       │        │
 * │  │ Gradient text line   │   (images/illust)  │        │
 * │  │ Description          │                    │        │
 * │  │ [stat] [stat] [stat] │                    │        │
 * │  │ [CTA]  [CTA outline] │                    │        │
 * │  └─────────────────────┴────────────────────┘        │
 * └──────────────────────────────────────────────────────┘
 *
 * Features:
 * - Background blur orbs (3 positioned absolutely)
 * - Badge pill with icon + text (backdrop blur)
 * - Title with optional gradient accent line
 * - Mini-stat badges (icon + value + label)
 * - Dual action slots (primary + secondary)
 * - Right side slot for images/illustrations (hidden on mobile)
 * - Fully responsive (stacks on mobile)
 *
 * Dependencies: cn()
 *
 * @example
 * <HeroSection
 *   gradient="from-indigo-600 via-indigo-500 to-purple-600"
 *   badge={{ icon: <Search className="size-4" />, text: "Discover" }}
 *   title="Every project has"
 *   titleAccent="a story waiting"
 *   description="Browse components, patterns, and layouts ready to steal."
 *   stats={[
 *     { icon: <Box className="size-4" />, value: "200+", label: "Components" },
 *     { icon: <Star className="size-4" />, value: "4.9", label: "Rating" },
 *   ]}
 *   primaryAction={<Button>Get Started</Button>}
 *   secondaryAction={<Button variant="outline">Learn More</Button>}
 *   rightSlot={<HeroIllustration />}
 * />
 */

interface HeroStat {
	icon: ReactNode
	value: string
	label: string
}

interface HeroBadge {
	icon?: ReactNode
	text: string
}

interface HeroSectionProps {
	/** Tailwind gradient classes (e.g., "from-indigo-600 via-indigo-500 to-purple-600") */
	gradient?: string
	/** Badge pill above title */
	badge?: HeroBadge
	/** Main title text */
	title: string
	/** Gradient-colored accent line below title */
	titleAccent?: string
	/** Gradient classes for the accent text */
	accentGradient?: string
	/** Description paragraph */
	description?: string
	/** Array of stat badges */
	stats?: HeroStat[]
	/** Primary CTA button */
	primaryAction?: ReactNode
	/** Secondary CTA button */
	secondaryAction?: ReactNode
	/** Right side content (images, illustrations) — hidden on mobile */
	rightSlot?: ReactNode
	/** Additional className */
	className?: string
}

export function HeroSection({
	gradient = 'from-primary via-primary/80 to-primary/60',
	badge,
	title,
	titleAccent,
	accentGradient = 'from-yellow-200 via-pink-200 to-white',
	description,
	stats,
	primaryAction,
	secondaryAction,
	rightSlot,
	className,
}: HeroSectionProps) {
	return (
		<section
			className={cn(
				'relative overflow-hidden rounded-lg bg-gradient-to-r px-6 py-10 text-white md:px-10 md:py-14',
				gradient,
				className,
			)}
		>
			{/* Decorative blur orbs */}
			<div className='absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl' />
			<div className='absolute -bottom-20 -left-20 size-72 rounded-full bg-white/10 blur-3xl' />
			<div className='absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl' />

			<div className='relative z-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2'>
				{/* Left: Content */}
				<div className='max-w-xl'>
					{/* Badge */}
					{badge && (
						<div className='mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm'>
							{badge.icon}
							<span className='text-sm font-medium'>{badge.text}</span>
						</div>
					)}

					{/* Title */}
					<h1 className='text-3xl font-bold leading-tight md:text-5xl'>
						{title}
						{titleAccent && (
							<>
								<br />
								<span className={cn('bg-gradient-to-r bg-clip-text text-transparent', accentGradient)}>
									{titleAccent}
								</span>
							</>
						)}
					</h1>

					{/* Description */}
					{description && (
						<p className='mt-4 max-w-md text-lg text-white/90'>{description}</p>
					)}

					{/* Stats */}
					{stats && stats.length > 0 && (
						<div className='mt-6 flex flex-wrap gap-4'>
							{stats.map(stat => (
								<div
									key={stat.label}
									className='flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm'
								>
									<span className='text-white/80'>{stat.icon}</span>
									<span className='font-bold'>{stat.value}</span>
									<span className='text-sm text-white/70'>{stat.label}</span>
								</div>
							))}
						</div>
					)}

					{/* Actions */}
					{(primaryAction || secondaryAction) && (
						<div className='mt-8 flex flex-wrap gap-3'>
							{primaryAction}
							{secondaryAction}
						</div>
					)}
				</div>

				{/* Right: Visual slot (hidden on mobile) */}
				{rightSlot && (
					<div className='relative hidden justify-end md:flex'>{rightSlot}</div>
				)}
			</div>
		</section>
	)
}
