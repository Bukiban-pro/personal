'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * OTP resend button with cooldown timer that survives page refresh (localStorage).
 *
 * Dependencies: React, cn()
 *
 * @example
 * <ResendOtpButton
 *   cooldownSeconds={60}
 *   onResend={() => mutation.mutate({ email })}
 * />
 */

interface ResendOtpButtonProps {
	onResend: () => void
	/** Cooldown duration in seconds */
	cooldownSeconds?: number
	/** localStorage key for timer persistence */
	storageKey?: string
	className?: string
}

export function ResendOtpButton({
	onResend,
	cooldownSeconds = 60,
	storageKey = 'otp_cooldown_end',
	className,
}: ResendOtpButtonProps) {
	const [cooldown, setCooldown] = useState(0)

	const handleClick = () => {
		if (cooldown > 0) return
		onResend()
		const endTime = Date.now() + cooldownSeconds * 1000
		if (typeof window !== 'undefined') {
			localStorage.setItem(storageKey, endTime.toString())
		}
		setCooldown(cooldownSeconds)
	}

	useEffect(() => {
		if (typeof window === 'undefined') return
		// Restore cooldown from localStorage on mount
		const saved = localStorage.getItem(storageKey)
		if (saved) {
			const remaining = Math.floor((parseInt(saved) - Date.now()) / 1000)
			if (remaining > 0) setCooldown(remaining)
			else if (typeof window !== 'undefined') localStorage.removeItem(storageKey)
		}

		if (cooldown === 0) return

		const interval = setInterval(() => {
			setCooldown(prev => {
				if (prev <= 1) {
					localStorage.removeItem(storageKey)
					clearInterval(interval)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [cooldown, storageKey])

	return (
		<button
			type='button'
			onClick={handleClick}
			disabled={cooldown > 0}
			className={cn(
				'text-xs font-medium transition-colors hover:underline',
				cooldown > 0
					? 'text-primary/50 cursor-not-allowed pointer-events-none'
					: 'text-primary hover:text-primary/80 cursor-pointer',
				className,
			)}
		>
			{cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP?'}
		</button>
	)
}
