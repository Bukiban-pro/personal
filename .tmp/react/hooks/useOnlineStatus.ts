import { useState, useEffect, useCallback } from 'react'

/**
 * Detect online/offline status with recovery tracking.
 *
 * Dependencies: React
 *
 * @returns { isOnline, wasOffline, clearWasOffline }
 *
 * @example
 * const { isOnline, wasOffline, clearWasOffline } = useOnlineStatus()
 * if (!isOnline) return <OfflineBanner />
 * if (wasOffline) showToast('Back online!').then(clearWasOffline)
 */
export function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(true)
	const [wasOffline, setWasOffline] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return

		setIsOnline(navigator.onLine)

		const handleOnline = () => {
			setIsOnline(true)
			// wasOffline already set by handleOffline — no extra logic needed here
		}

		const handleOffline = () => {
			setIsOnline(false)
			setWasOffline(true)
		}

		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}, [])

	const clearWasOffline = useCallback(() => setWasOffline(false), [])

	return { isOnline, wasOffline, clearWasOffline }
}
