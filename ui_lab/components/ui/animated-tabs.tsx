'use client'

import { useState, useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * AnimatedTabs — Accessible tab group with a sliding indicator (framer-motion layoutId).
 * Full keyboard nav (Arrow keys, Home, End). ARIA compliant.
 *
 * Dependencies: framer-motion, cn() utility
 *
 * @example
 * const tabs = [
 *   { id: 'overview', label: 'Overview', content: <OverviewContent /> },
 *   { id: 'reviews',  label: 'Reviews',  badge: 42, content: <ReviewsContent /> },
 * ]
 * <AnimatedTabs tabs={tabs} />
 */

export interface Tab {
	id: string
	label: string
	badge?: number
	content: React.ReactNode
}

interface AnimatedTabsProps {
	tabs: Tab[]
	defaultTab?: string
	onTabChange?: (tabId: string) => void
	className?: string
}

export function AnimatedTabs({ tabs, defaultTab, onTabChange, className }: AnimatedTabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')
	const instanceId = useId()
	const layoutId = `tab-indicator-${instanceId}`

	const handleTabChange = (tabId: string) => {
		setActiveTab(tabId)
		onTabChange?.(tabId)
	}

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		const tabElements = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
		if (!tabElements) return
		let nextIndex = index

		if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
		else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
		else if (e.key === 'Home') nextIndex = 0
		else if (e.key === 'End') nextIndex = tabs.length - 1
		else return

		e.preventDefault()
		tabElements[nextIndex]?.focus()
		handleTabChange(tabs[nextIndex].id)
	}

	return (
		<div className={cn('w-full', className)}>
			{/* Tab list */}
			<div role="tablist" className="flex border-b border-border">
				{tabs.map((tab, index) => {
					const isActive = activeTab === tab.id
					return (
						<button
							type="button"
							key={tab.id}
							role="tab"
							id={`tab-${instanceId}-${tab.id}`}
							aria-selected={isActive}
							aria-controls={`panel-${instanceId}-${tab.id}`}
							tabIndex={isActive ? 0 : -1}
							onClick={() => handleTabChange(tab.id)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							className={cn(
								'relative px-4 py-2.5 text-sm font-medium transition-colors outline-none',
								'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-md',
								isActive
									? 'text-primary'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							<span className="flex items-center gap-2">
								{tab.label}
								{tab.badge !== undefined && (
									<span
										className={cn(
											'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium',
											isActive
												? 'bg-primary/10 text-primary'
												: 'bg-muted text-muted-foreground',
										)}
									>
										{tab.badge.toLocaleString()}
									</span>
								)}
							</span>
							{/* Animated underline indicator */}
							{isActive && (
								<motion.div
									layoutId={layoutId}
									className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
									transition={{ type: 'spring', stiffness: 500, damping: 30 }}
								/>
							)}
						</button>
					)
				})}
			</div>
			{/* Tab panels */}
			{tabs.map((tab) => (
				<TabPanel
					key={tab.id}
					id={`panel-${instanceId}-${tab.id}`}
					labelledBy={`tab-${instanceId}-${tab.id}`}
					active={activeTab === tab.id}
				>
					{tab.content}
				</TabPanel>
			))}
		</div>
	)
}

/** Individual tab panel with enter animation */
export function TabPanel({
	children,
	active,
	id,
	labelledBy,
	className,
}: {
	children: React.ReactNode
	active: boolean
	id?: string
	labelledBy?: string
	className?: string
}) {
	if (!active) return <div id={id} role="tabpanel" aria-labelledby={labelledBy} hidden />
	return (
		<motion.div
			id={id}
			role="tabpanel"
			aria-labelledby={labelledBy}
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={cn('py-4 outline-none', className)}
			tabIndex={0}
		>
			{children}
		</motion.div>
	)
}
