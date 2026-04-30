import { useEffect, useCallback } from 'react'

/**
 * Warn users when leaving the page during critical operations.
 * Shows browser's native "Leave site?" dialog.
 *
 * Note: Modern browsers ignore custom message text for security reasons.
 *
 * Dependencies: React
 *
 * @param shouldWarn - Whether the warning should be active
 * @param message - Optional message (for debugging; browsers ignore it)
 *
 * @example
 * useBeforeUnloadWarning(hasUnsavedChanges)
 * useBeforeUnloadWarning(isUploading, 'Upload in progress')
 */
export function useBeforeUnloadWarning(
	shouldWarn: boolean,
	message?: string,
): void {
	const handleBeforeUnload = useCallback(
		(event: BeforeUnloadEvent) => {
			if (!shouldWarn) return
			event.preventDefault()
			event.returnValue = message || 'You have unsaved changes.'
			return message || 'You have unsaved changes.'
		},
		[shouldWarn, message],
	)

	useEffect(() => {
		if (!shouldWarn) return
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [shouldWarn, handleBeforeUnload])
}
