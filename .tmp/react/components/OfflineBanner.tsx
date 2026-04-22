'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * OfflineBanner — Fixed bottom bar when user loses connection.
 * Auto-hides when connection is restored.
 * Pair with useOnlineStatus hook.
 *
 * Dependencies: lucide-react, cn(), useOnlineStatus hook
 *
 * @example
 * // In your root layout:
 * const { isOnline } = useOnlineStatus()
 * {!isOnline && <OfflineBanner />}
 *
 * // Or embed the hook directly:
 * <OfflineBanner />
 */

interface OfflineBannerProps {
	/** Externally controlled visibility (if not using built-in detection) */
	isOffline?: boolean
	className?: string
}

export function OfflineBanner({ isOffline, className }: OfflineBannerProps) {
	// If no external control, detect automatically
	const shouldShow = isOffline ?? (typeof navigator !== 'undefined' && !navigator.onLine)

	if (!shouldShow) return null

	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 right-0 z-50',
				'bg-amber-500 dark:bg-amber-600 text-amber-50',
				'px-4 py-3',
				'flex items-center justify-center gap-3',
				'animate-in slide-in-from-bottom duration-300',
				className,
			)}
		>
			<WifiOff className='size-5' />
			<span className='font-medium'>
				You&apos;re offline. Some features may be unavailable.
			</span>
			<button
				type='button'
				onClick={() => window.location.reload()}
				className='inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 rounded-full text-sm font-medium hover:bg-amber-700 transition'
				aria-label='Retry connection'
			>
				<RefreshCw className='size-3.5' />
				Retry
			</button>
		</div>
	)
}
