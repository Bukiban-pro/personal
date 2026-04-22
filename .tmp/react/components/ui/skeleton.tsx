import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton with shimmer gradient animation.
 * Much more polished than plain pulse animation.
 *
 * Dependencies: cn(), Tailwind CSS, globals.css (provides @keyframes shimmer + .animate-shimmer)
 *
 * @example
 * <Skeleton className="h-6 w-48" />
 * <Skeleton className="h-40 rounded-lg" />
 */
export const Skeleton = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				'relative overflow-hidden rounded-md bg-muted/20',
				'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer',
				'before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent',
				className,
			)}
			{...props}
		/>
	)
})
Skeleton.displayName = 'Skeleton'
