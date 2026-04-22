'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * AppShell — 3-column authenticated app layout (sidebar + content + [right panel]).
 *
 * Stolen from: Chefkix main layout — the gold standard social-app shell.
 *
 * Structure: flex h-screen → header → (sidebar | content | right-panel)
 * - Header: full-width, fixed height, border-bottom
 * - Sidebar: fixed-width, scrollable, hidden on mobile
 * - Content: flex-1, scrollable, padded
 * - Right panel: optional, fixed-width, hidden on small screens
 *
 * Dependencies: cn()
 *
 * @example
 * <AppShell
 *   header={<Topbar />}
 *   sidebar={<LeftSidebar />}
 *   rightPanel={<RightSidebar />}
 * >
 *   <DashboardPage />
 * </AppShell>
 */

interface AppShellProps {
	children: ReactNode
	/** Full-width top bar */
	header?: ReactNode
	/** Left sidebar (icon rail or full-width) */
	sidebar?: ReactNode
	/** Optional right panel (widgets, chat, context) */
	rightPanel?: ReactNode
	/** Additional layers rendered outside the grid (drawers, modals, FABs) */
	overlays?: ReactNode
	className?: string
}

export function AppShell({
	children,
	header,
	sidebar,
	rightPanel,
	overlays,
	className,
}: AppShellProps) {
	return (
		<div className={cn('flex h-screen w-full flex-col overflow-hidden bg-background', className)}>
			{/* Header — spans full width, never scrolls */}
			{header}

			{/* Body — sidebars + scrollable content */}
			<div className='flex flex-1 overflow-hidden'>
				{/* Left sidebar — hidden on mobile, fixed width */}
				{sidebar}

				{/* Main content — flex-1, independently scrollable */}
				<main className='flex flex-1 flex-col gap-4 overflow-y-auto scroll-smooth p-4 lg:gap-6 lg:p-6'>
					{children}
				</main>

				{/* Right panel — hidden below xl, fixed width */}
				{rightPanel}
			</div>

			{/* Overlays — drawers, toasts, modals, FABs */}
			{overlays}
		</div>
	)
}
