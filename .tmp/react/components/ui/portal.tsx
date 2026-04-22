'use client'

import { useEffect, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Portal — Render children outside parent stacking context.
 * Critical for modals, tooltips, and overlays that need to escape
 * CSS stacking contexts (transform, filter, backdrop-blur, etc.).
 *
 * Dependencies: react-dom
 *
 * @example
 * <Portal>
 *   <div className="fixed inset-0 z-50">Modal content</div>
 * </Portal>
 */

interface PortalProps {
	children: ReactNode
	/** Custom container element (defaults to document.body) */
	container?: Element | null
}

export function Portal({ children, container }: PortalProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null
	return createPortal(children, container ?? document.body)
}

/**
 * Convenience wrapper for modal overlays.
 */
export function ModalPortal({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
	if (!isOpen) return null
	return <Portal>{children}</Portal>
}
