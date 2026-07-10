import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

/**
 * "Or" divider for auth forms (between credentials and social login).
 *
 * Dependencies: cn()
 *
 * @example
 * <DividerOr />
 * <DividerOr>Or continue with</DividerOr>
 */

interface DividerOrProps {
	children?: ReactNode
	className?: string
	lineClassName?: string
	textClassName?: string
}

export function DividerOr({
	children = 'Or',
	className,
	lineClassName = 'h-px bg-border',
	textClassName = 'text-sm text-muted-foreground font-medium',
}: DividerOrProps) {
	return (
		<div className={cn('flex items-center', className)}>
			<div className={cn('flex-1', lineClassName)} />
			<span className={cn('mx-3 py-0.5', textClassName)}>
				{children}
			</span>
			<div className={cn('flex-1', lineClassName)} />
		</div>
	)
}
