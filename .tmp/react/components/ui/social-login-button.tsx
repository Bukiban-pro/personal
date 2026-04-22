import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Social login button (Google, GitHub, Apple, etc.).
 *
 * Dependencies: cn()
 *
 * @example
 * <SocialLoginButton
 *   icon={<FcGoogle className="size-5" />}
 *   label="Continue with Google"
 *   onClick={handleGoogleLogin}
 * />
 */

export interface SocialLoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: React.ReactNode
	label: string
}

export const SocialLoginButton = React.forwardRef<HTMLButtonElement, SocialLoginButtonProps>(
	({ icon, label, className, disabled = false, ...props }, ref) => {
	return (
		<button
			ref={ref}
			type='button'
			disabled={disabled}
			className={cn(
				'flex h-11 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors',
				'border-input bg-background hover:bg-accent hover:text-accent-foreground',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
				disabled && 'cursor-not-allowed opacity-50',
				className,
			)}
			{...props}
		>
			{icon}
			<span>{label}</span>
		</button>
	)
})
SocialLoginButton.displayName = 'SocialLoginButton'
