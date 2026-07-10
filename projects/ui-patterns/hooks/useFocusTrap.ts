import { useEffect, useRef, useCallback } from 'react'

/**
 * Trap focus within a container (modals, drawers, popovers).
 * Replaces the `focus-trap-react` dependency.
 *
 * Features:
 * - Auto-focuses first focusable element on open
 * - Tab / Shift+Tab wraps at boundaries
 * - Restores focus to trigger element on close
 *
 * Dependencies: React
 *
 * @param isActive - Whether the trap is active
 * @returns Ref to attach to the container element
 *
 * @example
 * const trapRef = useFocusTrap<HTMLDivElement>(isOpen)
 * return <div ref={trapRef}>...modal content...</div>
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
	const containerRef = useRef<T>(null)
	const previouslyFocusedRef = useRef<HTMLElement | null>(null)

	const getFocusableElements = useCallback(() => {
		if (!containerRef.current) return []

		const selectors = [
			'a[href]',
			'button:not([disabled])',
			'textarea:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'[tabindex]:not([tabindex="-1"])',
		].join(', ')

		return Array.from(
			containerRef.current.querySelectorAll<HTMLElement>(selectors),
		).filter(el => el.offsetParent !== null)
	}, [])

	useEffect(() => {
		if (!isActive) {
			if (previouslyFocusedRef.current) {
				previouslyFocusedRef.current.focus()
				previouslyFocusedRef.current = null
			}
			return
		}

		previouslyFocusedRef.current = document.activeElement as HTMLElement

		const focusTimer = setTimeout(() => {
			const focusable = getFocusableElements()
			if (focusable.length > 0) {
				focusable[0].focus()
			} else if (containerRef.current) {
				containerRef.current.setAttribute('tabindex', '-1')
				containerRef.current.focus()
			}
		}, 50)

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return

			const focusable = getFocusableElements()
			if (focusable.length === 0) return

			const first = focusable[0]
			const last = focusable[focusable.length - 1]
			const active = document.activeElement

			if (e.shiftKey) {
				if (active === first) {
					e.preventDefault()
					last.focus()
				}
			} else {
				if (active === last) {
					e.preventDefault()
					first.focus()
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			clearTimeout(focusTimer)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isActive, getFocusableElements])

	return containerRef
}
