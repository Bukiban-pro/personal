'use client'

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

/**
 * SidebarLayout — Collapsible sidebar with context + persistent state.
 *
 * Stolen from: 5TProMart's SidebarContext + Sidebar composition.
 *
 * Features:
 * - Collapsed/expanded state persisted to localStorage
 * - Animated width transition (CSS transition, not Framer — no JS overhead)
 * - Context hook for any child to read/toggle state
 * - Keyboard shortcut: Ctrl+B to toggle (VS Code convention)
 *
 * Dependencies: cn(), React
 *
 * @example
 * <SidebarProvider>
 *   <SidebarLayout
 *     sidebar={<Sidebar />}
 *     header={<Topbar />}
 *   >
 *     <DashboardContent />
 *   </SidebarLayout>
 * </SidebarProvider>
 *
 * // Inside any child:
 * const { isCollapsed, toggle } = useSidebar()
 */

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEY = 'sidebar-collapsed'
export const SIDEBAR_WIDTH_EXPANDED = 254
export const SIDEBAR_WIDTH_COLLAPSED = 80

// ============================================
// CONTEXT
// ============================================

interface SidebarContextValue {
	isCollapsed: boolean
	toggle: () => void
	sidebarWidth: number
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar() {
	const ctx = useContext(SidebarContext)
	if (!ctx) throw new Error('useSidebar must be used within <SidebarProvider>')
	return ctx
}

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false)

	// Hydrate from localStorage (SSR-safe)
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved === 'true') setIsCollapsed(true)
	}, [])

	// Persist on change
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, String(isCollapsed))
	}, [isCollapsed])

	const toggle = useCallback(() => setIsCollapsed(prev => !prev), [])

	// Keyboard shortcut: Ctrl/Cmd + B
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
				e.preventDefault()
				toggle()
			}
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [toggle])

	const sidebarWidth = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED

	return (
		<SidebarContext.Provider value={{ isCollapsed, toggle, sidebarWidth }}>
			{children}
		</SidebarContext.Provider>
	)
}

// ============================================
// LAYOUT COMPONENT
// ============================================

interface SidebarLayoutProps {
	children: ReactNode
	sidebar: ReactNode
	header?: ReactNode
	className?: string
}

export function SidebarLayout({ children, sidebar, header, className }: SidebarLayoutProps) {
	const { sidebarWidth } = useSidebar()

	return (
		<div className={cn('flex h-screen flex-col overflow-hidden bg-background', className)}>
			{header}
			<div className='flex flex-1 overflow-hidden'>
				<aside
					className='shrink-0 overflow-y-auto transition-[width] duration-300 ease-in-out'
					style={{ width: sidebarWidth }}
				>
					{sidebar}
				</aside>
				<main className='flex flex-1 flex-col overflow-y-auto'>
					{children}
				</main>
			</div>
		</div>
	)
}
