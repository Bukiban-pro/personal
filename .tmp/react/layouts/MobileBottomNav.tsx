'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * MobileBottomNav — iOS/Android-style bottom navigation with elevated center action.
 *
 * Stolen from: Chefkix MobileBottomNav — 5-item bottom nav with floating center CTA.
 *
 * Features:
 * - Safe area inset for notched devices (env(safe-area-inset-bottom))
 * - Backdrop blur for glass effect
 * - Center item elevated with gradient background
 * - Active indicator dot animation
 * - Hidden on desktop (md:hidden)
 *
 * Dependencies: cn()
 *
 * @example
 * <MobileBottomNav
 *   items={[
 *     { href: '/', icon: Home, label: 'Home' },
 *     { href: '/explore', icon: Compass, label: 'Explore' },
 *     { href: '/create', icon: Plus, label: 'Create', isCenter: true },
 *     { href: '/notifications', icon: Bell, label: 'Alerts', badge: 3 },
 *     { href: '/profile', icon: User, label: 'Profile' },
 *   ]}
 *   currentPath={pathname}
 * />
 */

interface NavItem {
	href: string
	icon: React.ComponentType<{ className?: string }>
	label: string
	/** Elevated center button */
	isCenter?: boolean
	/** Notification badge count (0 = hidden) */
	badge?: number
}

interface MobileBottomNavProps {
	items: NavItem[]
	/** Current route path for active detection */
	currentPath: string
	/** Custom link component (Next.js Link, React Router Link, etc.) */
	linkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }>
	className?: string
}

export function MobileBottomNav({
	items,
	currentPath,
	linkComponent: LinkComp = 'a' as unknown as React.ComponentType<{ href: string; className?: string; children: ReactNode }>,
	className,
}: MobileBottomNavProps) {
	const isActive = (href: string) => {
		if (href === '/') return currentPath === '/'
		return currentPath.startsWith(href)
	}

	return (
		<nav
			className={cn(
				'fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around',
				'border-t border-border bg-background/95 backdrop-blur-xl',
				'px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2',
				'md:hidden',
				className,
			)}
			aria-label='Mobile navigation'
		>
			{items.map(item => {
				const Icon = item.icon
				const active = isActive(item.href)

				if (item.isCenter) {
					return (
						<LinkComp
							key={item.href}
							href={item.href}
							className='relative -mt-6 flex flex-1 max-w-20 flex-col items-center justify-center gap-1'
						>
							<div className='grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg'>
								<Icon className='size-7' />
							</div>
						</LinkComp>
					)
				}

				return (
					<LinkComp
						key={item.href}
						href={item.href}
						className={cn(
							'relative flex flex-1 max-w-20 flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs',
							active ? 'text-primary' : 'text-muted-foreground',
						)}
					>
						{/* Active indicator dot */}
						{active && (
							<span className='absolute -top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary' />
						)}

						<span className='relative'>
							<Icon className='size-6' />
							{/* Badge */}
							{typeof item.badge === 'number' && item.badge > 0 && (
								<span className='absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground'>
									{item.badge > 9 ? '9+' : item.badge}
								</span>
							)}
						</span>
						<span className='font-medium'>{item.label}</span>
					</LinkComp>
				)
			})}
		</nav>
	)
}
