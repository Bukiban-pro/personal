import { useCallback } from 'react'

/**
 * Keyboard shortcut for form submission (Ctrl/Cmd + Enter).
 *
 * Dependencies: React
 *
 * @example
 * const { handleKeyDown } = useFormShortcut(() => form.handleSubmit(onSubmit)())
 * return <form onKeyDown={handleKeyDown}>...</form>
 */
export function useFormShortcut(
	onSubmit: () => void,
	options?: { enabled?: boolean; requireCtrl?: boolean }
) {
	const { enabled = true, requireCtrl = true } = options || {}

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent | KeyboardEvent) => {
			if (!enabled) return
			const isCtrlOrCmd = e.ctrlKey || e.metaKey
			const isEnter = e.key === 'Enter'

			if (requireCtrl ? isCtrlOrCmd && isEnter : isEnter) {
				if (isCtrlOrCmd && isEnter) {
					e.preventDefault()
					onSubmit()
				}
			}
		},
		[enabled, onSubmit, requireCtrl]
	)

	return { handleKeyDown }
}

/**
 * Format keyboard shortcut for display based on platform.
 * e.g. "Ctrl+Enter" → "⌘+Enter" on Mac
 */
export function formatShortcut(shortcut: string): string {
	const isMac = typeof navigator !== 'undefined' && navigator?.platform?.includes('Mac')
	return shortcut
		.replace(/Ctrl/gi, isMac ? '⌘' : 'Ctrl')
		.replace(/Alt/gi, isMac ? '⌥' : 'Alt')
		.replace(/Shift/gi, isMac ? '⇧' : 'Shift')
}

/**
 * Inline keyboard shortcut badge.
 *
 * @example
 * <ShortcutHint shortcut="Ctrl+Enter" />
 */
export function ShortcutHint({ shortcut }: { shortcut: string }) {
	return (
		<kbd className='inline-flex items-center px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded border'>
			{formatShortcut(shortcut)}
		</kbd>
	)
}
