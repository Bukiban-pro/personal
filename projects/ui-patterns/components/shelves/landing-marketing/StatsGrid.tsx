'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * StatsGrid — Responsive dashboard stat cards in 1→2→4 column grid.
 *
 * Stolen from: Composite pattern across Bookverse, Chefkix, and 5TProMart dashboards.
 *
 * Layout anatomy:
 * ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
 * │ [icon]   │ │ [icon]   │ │ [icon]   │ │ [icon]   │
 * │ 1,234    │ │ $5.6K    │ │ 89%      │ │ 42       │
 * │ Users    │ │ Revenue  │ │ Rate     │ │ Orders   │
 * │ ▲ 12.5%  │ │ ▼ 3.2%   │ │ ▲ 5.1%   │ │ — 0%     │
 * └──────────┘ └──────────┘ └──────────┘ └──────────┘
 *
 * Features:
 * - Responsive grid: 1 col (mobile) → 2 col (sm) → 4 col (lg)
 * - Optional trend indicator (up/down/neutral)
 * - Icon with background tint
 * - Configurable column count
 *
 * Dependencies: cn()
 *
 * @example
 * <StatsGrid
 *   stats={[
 *     { icon: <Users className="size-5" />, value: "1,234", label: "Total Users", trend: { value: 12.5, direction: 'up' } },
 *     { icon: <DollarSign className="size-5" />, value: "$5.6K", label: "Revenue", trend: { value: 3.2, direction: 'down' } },
 *     { icon: <Activity className="size-5" />, value: "89%", label: "Conversion", trend: { value: 5.1, direction: 'up' } },
 *     { icon: <Package className="size-5" />, value: "42", label: "Orders" },
 *   ]}
 * />
 */

interface StatTrend {
	/** Percentage value (displayed as +/-N%) */
	value: number
	direction: 'up' | 'down' | 'neutral'
}

interface StatItem {
	icon: ReactNode
	/** Display value (pre-formatted: "1,234", "$5.6K", "89%") */
	value: string
	label: string
	trend?: StatTrend
	/** Icon background tint. Defaults to "bg-primary/10 text-primary" */
	iconClassName?: string
}

interface StatsGridProps {
	stats: StatItem[]
	/** Grid columns at lg breakpoint. Default: stats.length (max 4) */
	columns?: 2 | 3 | 4
	className?: string
}

const colsMap = {
	2: 'sm:grid-cols-2',
	3: 'sm:grid-cols-2 lg:grid-cols-3',
	4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const

export function StatsGrid({ stats, columns, className }: StatsGridProps) {
	const cols = columns ?? (Math.min(stats.length, 4) as 2 | 3 | 4)

	return (
		<div className={cn('grid grid-cols-1 gap-4', colsMap[cols], className)}>
			{stats.map(stat => (
				<div
					key={stat.label}
					className='flex items-start gap-4 rounded-lg border border-border bg-card p-5'
				>
					{/* Icon */}
					<div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', stat.iconClassName ?? 'bg-primary/10 text-primary')}>
						{stat.icon}
					</div>

					{/* Content */}
					<div className='min-w-0 flex-1'>
						<div className='text-2xl font-bold tracking-tight text-foreground'>{stat.value}</div>
						<div className='text-sm text-muted-foreground'>{stat.label}</div>

						{/* Trend */}
						{stat.trend && (
							<div className={cn(
								'mt-1 inline-flex items-center gap-1 text-xs font-medium',
								stat.trend.direction === 'up' && 'text-emerald-600 dark:text-emerald-400',
								stat.trend.direction === 'down' && 'text-red-600 dark:text-red-400',
								stat.trend.direction === 'neutral' && 'text-muted-foreground',
							)}>
								{stat.trend.direction === 'up' && '▲'}
								{stat.trend.direction === 'down' && '▼'}
								{stat.trend.direction === 'neutral' && '—'}
								{' '}{stat.trend.value}%
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	)
}
