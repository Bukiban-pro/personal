'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * EmptyState — Centered placeholder for empty lists, search results, etc.
 * Supports icon OR custom illustration/Lottie slot.
 *
 * Dependencies: cn()
 *
 * @example
 * <EmptyState
 *   icon={<Inbox className="size-16 text-primary" />}
 *   title="No messages yet"
 *   description="Start a conversation to see messages here."
 *   actionLabel="New Message"
 *   onAction={() => router.push('/compose')}
 * />
 */

interface EmptyStateProps {
	/** Icon or illustration element */
	icon?: ReactNode
	title: string
	description: string
	actionLabel?: string
	onAction?: () => void
	/** Action link href (renders <a> instead of <button> if set) */
	actionHref?: string
	/** Custom content below description (replaces default action button) */
	children?: ReactNode
	className?: string
}

export function EmptyState({
	icon,
	title,
	description,
	actionLabel,
	onAction,
	actionHref,
	children,
	className,
}: EmptyStateProps) {
	return (
		<div className={cn('flex min-h-[400px] flex-col items-center justify-center px-4 py-12', className)}>
			<div className='mx-auto max-w-md text-center'>
				{icon && (
					<div className='mb-6 flex justify-center'>
						<div className='rounded-full bg-primary/10 p-8'>
							{icon}
						</div>
					</div>
				)}

				<h3 className='mb-2 text-xl font-bold leading-tight'>{title}</h3>
				<p className='mb-6 leading-normal text-muted-foreground'>{description}</p>

				{children ? (
					children
				) : actionLabel ? (
					actionHref ? (
						<a
							href={actionHref}
							className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'
						>
							{actionLabel}
						</a>
					) : (
						<button
							type='button'
							onClick={onAction}
							className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'
						>
							{actionLabel}
						</button>
					)
				) : null}
			</div>
		</div>
	)
}
