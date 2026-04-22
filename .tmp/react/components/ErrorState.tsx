'use client'

import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ErrorState — Full-page or section error with retry and home button.
 *
 * Dependencies: lucide-react, cn()
 *
 * @example
 * <ErrorState onRetry={() => refetch()} />
 * <ErrorState title="404" message="Page not found" showHomeButton />
 */

interface ErrorStateProps {
	title?: string
	message?: string
	showHomeButton?: boolean
	homeHref?: string
	onRetry?: () => void
	/** Replace default icon with custom element */
	icon?: React.ReactNode
	className?: string
}

export function ErrorState({
	title = 'Something went wrong',
	message = 'We encountered an error while loading this content. Please try again.',
	showHomeButton = true,
	homeHref = '/',
	onRetry,
	icon,
	className,
}: ErrorStateProps) {
	return (
		<div className={cn('flex min-h-[400px] flex-col items-center justify-center px-4', className)}>
			<div className='mx-auto max-w-md text-center'>
				<div className='mb-6 flex justify-center'>
					{icon || (
						<div className='rounded-full bg-destructive/10 p-6'>
							<AlertCircle className='size-16 text-destructive' />
						</div>
					)}
				</div>

				<h1 className='mb-2 text-2xl font-bold leading-tight'>{title}</h1>
				<p className='mb-8 leading-normal text-muted-foreground'>{message}</p>

				<div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
					{onRetry && (
						<button
							type='button'
							onClick={onRetry}
							className='inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90'
						>
							<RefreshCw className='size-4' />
							Try Again
						</button>
					)}
					{showHomeButton && (
						<a
							href={homeHref}
							className={cn(
								'inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium',
								onRetry
									? 'border border-input bg-background hover:bg-accent'
									: 'bg-primary text-primary-foreground hover:bg-primary/90',
							)}
						>
							<Home className='size-4' />
							Go Home
						</a>
					)}
				</div>
			</div>
		</div>
	)
}
