'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * StarRating — Interactive star rating with hover preview and readonly mode.
 *
 * Dependencies: lucide-react, cn() utility
 *
 * Features:
 * - Click to rate (1–5 stars)
 * - Hover preview with spring animation
 * - Readonly display mode
 * - Size variants: sm / md / lg
 * - Optional numeric value display
 * - Optional prompt label
 *
 * @example
 * <StarRating value={4} onChange={setRating} />
 * <StarRating value={3.5} readonly showValue />
 */

interface StarRatingProps {
	value?: number
	onChange?: (rating: number) => void
	readonly?: boolean
	size?: 'sm' | 'md' | 'lg'
	showValue?: boolean
	label?: string
	className?: string
}

export function StarRating({
	value = 0,
	onChange,
	readonly = false,
	size = 'md',
	showValue = false,
	label,
	className,
}: StarRatingProps) {
	const [hoverRating, setHoverRating] = useState(0)
	const [rating, setRating] = useState(value)

	const handleClick = (star: number) => {
		if (readonly) return
		setRating(star)
		onChange?.(star)
	}

	const sizeClasses = {
		sm: 'size-4',
		md: 'size-6',
		lg: 'size-8',
	}

	const buttonSizeClasses = {
		sm: 'size-7 p-0.5',
		md: 'size-9 p-1',
		lg: 'size-11 p-1',
	}

	const displayRating = hoverRating || rating

	return (
		<div className={cn('flex flex-col items-center gap-2', className)}>
			{/* Optional prompt label */}
			{label && !readonly && (
				<span className="text-sm font-medium text-foreground">{label}</span>
			)}

			<div className="flex gap-1" role="radiogroup" aria-label={label || 'Star rating'}>
				{[1, 2, 3, 4, 5].map(star => (
					<button
						key={star}
						type="button"
						role="radio"
						aria-checked={star === rating}
						aria-label={`${star} star${star > 1 ? 's' : ''}`}
						onClick={() => handleClick(star)}
						onMouseEnter={() => !readonly && setHoverRating(star)}
						onMouseLeave={() => !readonly && setHoverRating(0)}
						disabled={readonly}
						className={cn(
							buttonSizeClasses[size],
							'transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
							readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125 hover:rotate-[15deg]',
						)}
					>
						<Star
							className={cn(
								sizeClasses[size],
								'transition-colors',
								star <= displayRating
									? 'fill-[var(--color-warning,#eab308)] text-[var(--color-warning,#eab308)]'
									: 'text-muted-foreground/40',
							)}
						/>
					</button>
				))}
			</div>

			{showValue && (
				<span className="text-xs text-muted-foreground">
					{rating.toFixed(1)} out of 5
				</span>
			)}
		</div>
	)
}
