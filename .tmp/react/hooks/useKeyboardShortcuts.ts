import { useEffect, useCallback, useRef } from 'react'

/**
 * Declarative keyboard shortcut system with modifier support.
 *
 * Features:
 * - Input-field awareness (disables in inputs unless overridden)
 * - Modifier keys (ctrl/cmd, shift, alt)
 * - Per-shortcut enable/disable
 * - preventDefault option
 *
 * Dependencies: React
 *
 * @example
 * useKeyboardShortcuts([
 *   { key: 'Enter', action: handleConfirm, description: 'Confirm' },
 *   { key: 'Escape', action: handleClose, description: 'Close' },
 *   { key: 'k', ctrl: true, action: openSearch, description: 'Search' },
 * ])
 */

export interface KeyboardShortcut {
	key: string
	ctrl?: boolean
	shift?: boolean
	alt?: boolean
	action: () => void
	description?: string
	enabled?: boolean
	preventDefault?: boolean
}

interface UseKeyboardShortcutsOptions {
	disableInInputs?: boolean
	isGlobal?: boolean
}

export function useKeyboardShortcuts(
	shortcuts: KeyboardShortcut[],
	options: UseKeyboardShortcutsOptions = {}
) {
	const { disableInInputs = true, isGlobal = false } = options
	const shortcutsRef = useRef(shortcuts)
	shortcutsRef.current = shortcuts

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (disableInInputs) {
				const target = event.target as HTMLElement
				const tag = target.tagName.toLowerCase()
				const isInput = tag === 'input' || tag === 'textarea' || target.isContentEditable
				if (isInput && event.key !== 'Escape' && !event.key.startsWith('F')) {
					return
				}
			}

			for (const shortcut of shortcutsRef.current) {
				if (shortcut.enabled === false) continue

				const ctrlMatch = shortcut.ctrl
					? (event.ctrlKey || event.metaKey)
					: !event.ctrlKey && !event.metaKey
				const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
				const altMatch = shortcut.alt ? event.altKey : !event.altKey
				const keyMatch =
					event.key.toLowerCase() === shortcut.key.toLowerCase() ||
					event.code.toLowerCase() === `key${shortcut.key.toLowerCase()}`

				if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
					if (shortcut.preventDefault !== false) event.preventDefault()
					shortcut.action()
					return
				}
			}
		},
		[disableInInputs]
	)

	useEffect(() => {
		const target = isGlobal ? window : document
		target.addEventListener('keydown', handleKeyDown as EventListener)
		return () => target.removeEventListener('keydown', handleKeyDown as EventListener)
	}, [handleKeyDown, isGlobal])
}

/** Platform-aware modifier symbol (⌘ on Mac, Ctrl elsewhere) */
export function getModifierSymbol(): string {
	if (typeof navigator === 'undefined') return 'Ctrl'
	return navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'
}

/** Format a shortcut definition for display */
export function formatShortcutLabel(
	shortcut: Pick<KeyboardShortcut, 'key' | 'ctrl' | 'shift' | 'alt'>
): string {
	const parts: string[] = []
	if (shortcut.ctrl) parts.push(getModifierSymbol())
	if (shortcut.shift) parts.push('Shift')
	if (shortcut.alt) parts.push('Alt')

	const keyDisplay: Record<string, string> = {
		Enter: '↵', Escape: 'Esc',
		ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
		' ': 'Space',
	}
	parts.push(keyDisplay[shortcut.key] || shortcut.key.toUpperCase())
	return parts.join('+')
}
