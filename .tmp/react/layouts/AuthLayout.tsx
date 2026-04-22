'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * AuthLayout — Centered card or 50/50 split layout for authentication pages.
 *
 * Stolen from: Chefkix (auth pages) + Bookverse (auth flow).
 *
 * Two modes:
 * - 'centered': Card centered on gradient/image background
 * - 'split': Left content panel + right decorative panel (hidden on mobile)
 *
 * Dependencies: cn()
 *
 * @example
 * // Centered mode (default)
 * <AuthLayout>
 *   <LoginForm />
 * </AuthLayout>
 *
 * // Split mode
 * <AuthLayout
 *   variant="split"
 *   decorative={
 *     <div className="bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
 *       <BrandIllustration />
 *     </div>
 *   }
 * >
 *   <RegisterForm />
 * </AuthLayout>
 */

interface AuthLayoutProps {
	children: ReactNode
	variant?: 'centered' | 'split'
	/** Decorative panel content (split mode only) */
	decorative?: ReactNode
	/** Which side gets the form. Default: 'left' */
	formSide?: 'left' | 'right'
	className?: string
}

export function AuthLayout({
	children,
	variant = 'centered',
	decorative,
	formSide = 'left',
	className,
}: AuthLayoutProps) {
	if (variant === 'split') {
		return (
			<div className={cn('flex min-h-screen', className)}>
				{/* Form side */}
				<div
					className={cn(
						'flex w-full items-center justify-center px-6 py-12 lg:w-1/2',
						formSide === 'right' && 'order-2',
					)}
				>
					<div className='w-full max-w-md space-y-8'>{children}</div>
				</div>

				{/* Decorative side — hidden on mobile */}
				<div
					className={cn(
						'hidden lg:block lg:w-1/2',
						formSide === 'right' && 'order-1',
					)}
				>
					{decorative ?? (
						<div className='flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background'>
							<div className='text-center'>
								<div className='mx-auto mb-4 size-24 rounded-2xl bg-primary/20' />
								<p className='text-lg font-medium text-muted-foreground'>Your brand here</p>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}

	// Centered mode
	return (
		<div
			className={cn(
				'flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12',
				className,
			)}
		>
			{/* Decorative background blurs */}
			<div className='pointer-events-none fixed inset-0 overflow-hidden' aria-hidden='true'>
				<div className='absolute -top-40 -right-40 size-80 rounded-full bg-primary/10 blur-3xl' />
				<div className='absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/5 blur-3xl' />
			</div>

			{/* Card */}
			<div className='relative w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg'>
				{children}
			</div>
		</div>
	)
}
