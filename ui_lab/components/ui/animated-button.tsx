'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { BUTTON_HOVER, BUTTON_TAP, TRANSITION_SPRING } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * Animated button with Framer Motion hover/tap physics + optional shine effect.
 * Respects prefers-reduced-motion.
 *
 * Dependencies: framer-motion, lucide-react, motion.ts, cn()
 *
 * @example
 * <AnimatedButton isLoading={isPending} shine>
 *   Create Account
 * </AnimatedButton>
 */

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean
	loadingText?: string
	/** Add shine sweep for premium CTAs */
	shine?: boolean
	variant?: string
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
	({ children, isLoading, loadingText, disabled, shine = false, className, ...props }, ref) => {
		const prefersReducedMotion = useReducedMotion()

		const shouldAnimate = !disabled && !isLoading && !prefersReducedMotion

		return (
			<motion.button
				ref={ref}
				disabled={disabled || isLoading}
				whileHover={shouldAnimate ? BUTTON_HOVER : undefined}
				whileTap={shouldAnimate ? BUTTON_TAP : undefined}
				transition={TRANSITION_SPRING}
				className={cn(
					'relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 py-2 text-sm font-medium transition-colors',
					'bg-primary text-primary-foreground hover:bg-primary/90',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
					'disabled:pointer-events-none disabled:opacity-50',
					className,
				)}
				{...props}
			>
				{isLoading ? (
					<>
						<Loader2 className='mr-2 size-4 animate-spin' />
						{loadingText || 'Loading...'}
					</>
				) : (
					<>
						{children}
						{shine && !disabled && (
							<div className='pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent' />
						)}
					</>
				)}
			</motion.button>
		)
	},
)

AnimatedButton.displayName = 'AnimatedButton'
