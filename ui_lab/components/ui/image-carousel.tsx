'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'

/**
 * ImageCarousel — Multi-image viewer with arrows, dots, swipe, and keyboard nav.
 *
 * Dependencies: framer-motion, lucide-react, cn() utility
 *
 * Features:
 * - Left/right arrows (hidden on single image)
 * - Dot indicators with counter badge
 * - Swipe gesture support (mobile)
 * - Keyboard navigation (← →)
 * - Accessible: aria labels, roledescription="carousel"
 *
 * @example
 * <ImageCarousel images={['/img1.jpg', '/img2.jpg']} alt="Product" />
 */

interface ImageCarouselProps {
	images: string[]
	alt?: string
	aspectRatio?: 'square' | 'video' | 'auto'
	className?: string
	showControls?: boolean
	showIndicators?: boolean
	enableSwipe?: boolean
	enableKeyboard?: boolean
	onImageError?: (index: number) => void
}

export function ImageCarousel({
	images,
	alt = 'Image',
	aspectRatio = 'auto',
	className,
	showControls = true,
	showIndicators = true,
	enableSwipe = true,
	enableKeyboard = true,
	onImageError,
}: ImageCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [direction, setDirection] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)

	const hasMultiple = images.length > 1

	const goToNext = useCallback(() => {
		if (!hasMultiple) return
		setDirection(1)
		setCurrentIndex(prev => (prev + 1) % images.length)
	}, [hasMultiple, images.length])

	const goToPrev = useCallback(() => {
		if (!hasMultiple) return
		setDirection(-1)
		setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
	}, [hasMultiple, images.length])

	const goToIndex = useCallback(
		(index: number) => {
			setDirection(index > currentIndex ? 1 : -1)
			setCurrentIndex(index)
		},
		[currentIndex],
	)

	// Keyboard navigation
	useEffect(() => {
		if (!enableKeyboard || !hasMultiple) return
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!containerRef.current?.contains(document.activeElement)) return
			if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev() }
			else if (e.key === 'ArrowRight') { e.preventDefault(); goToNext() }
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [enableKeyboard, hasMultiple, goToNext, goToPrev])

	// Swipe handling
	const handleDragEnd = useCallback(
		(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			if (!enableSwipe || !hasMultiple) return
			const swipeThreshold = 50
			if (info.offset.x > swipeThreshold) goToPrev()
			else if (info.offset.x < -swipeThreshold) goToNext()
		},
		[enableSwipe, hasMultiple, goToNext, goToPrev],
	)

	const variants = {
		enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
	}

	const aspectClasses = {
		square: 'aspect-square',
		video: 'aspect-video',
		auto: '',
	}

	if (images.length === 0) return null

	return (
		<div
			ref={containerRef}
			className={cn(
				'group relative overflow-hidden rounded-lg bg-muted',
				aspectClasses[aspectRatio],
				className,
			)}
			tabIndex={hasMultiple ? 0 : undefined}
			role="region"
			aria-label={`Image carousel, ${currentIndex + 1} of ${images.length}`}
			aria-roledescription="carousel"
		>
			{/* Image with directional slide animation */}
			<AnimatePresence initial={false} custom={direction} mode="wait">
				<motion.div
					key={currentIndex}
					custom={direction}
					variants={variants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{ duration: 0.25, ease: 'easeInOut' }}
					drag={enableSwipe && hasMultiple ? 'x' : false}
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.2}
					onDragEnd={handleDragEnd}
					className="relative size-full"
				>
					<img
						src={images[currentIndex]}
						alt={`${alt} ${currentIndex + 1} of ${images.length}`}
						className="absolute inset-0 size-full object-cover"
						onError={() => onImageError?.(currentIndex)}
					/>
				</motion.div>
			</AnimatePresence>

			{/* Navigation arrows (visible on hover) */}
			{showControls && hasMultiple && (
				<>
					<button
						type="button"
						onClick={goToPrev}
						className={cn(
							'absolute left-2 top-1/2 z-10 -translate-y-1/2',
							'flex size-8 items-center justify-center rounded-full',
							'bg-background/80 text-foreground shadow-sm backdrop-blur-sm',
							'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
							'hover:bg-background focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring',
						)}
						aria-label="Previous image"
					>
						<ChevronLeft className="size-5" />
					</button>
					<button
						type="button"
						onClick={goToNext}
						className={cn(
							'absolute right-2 top-1/2 z-10 -translate-y-1/2',
							'flex size-8 items-center justify-center rounded-full',
							'bg-background/80 text-foreground shadow-sm backdrop-blur-sm',
							'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
							'hover:bg-background focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring',
						)}
						aria-label="Next image"
					>
						<ChevronRight className="size-5" />
					</button>
				</>
			)}

			{/* Dot indicators */}
			{showIndicators && hasMultiple && (
				<div
					className={cn(
						'absolute bottom-3 left-1/2 z-10 -translate-x-1/2',
						'flex items-center gap-1.5 rounded-full bg-background/60 px-2 py-1 backdrop-blur-sm',
					)}
					role="tablist"
					aria-label="Image indicators"
				>
					{images.map((_, index) => (
						<button
							type="button"
							key={index}
							onClick={() => goToIndex(index)}
							className={cn(
								'size-2 rounded-full transition-all duration-200',
								index === currentIndex
									? 'bg-primary scale-110'
									: 'bg-muted-foreground/50 hover:bg-muted-foreground',
							)}
							role="tab"
							aria-selected={index === currentIndex}
							aria-label={`Go to image ${index + 1}`}
						/>
					))}
				</div>
			)}

			{/* Counter badge */}
			{hasMultiple && (
				<div
					className={cn(
						'absolute right-3 top-3 z-10',
						'rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm',
					)}
				>
					{currentIndex + 1}/{images.length}
				</div>
			)}
		</div>
	)
}
