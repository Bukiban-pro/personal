'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ImageLightbox — Click-to-zoom image viewer with zoom controls.
 *
 * Dependencies: lucide-react, cn() utility
 * NOTE: Uses a plain <dialog> element — no Radix/shadcn dependency.
 *
 * Features:
 * - Click child element to open fullscreen overlay
 * - Zoom in/out (0.5x–3x) with reset to 100%
 * - Click backdrop to close
 * - Keyboard: Escape to close (auto-focused on open)
 *
 * @example
 * <ImageLightbox src="/photo.jpg" alt="Product photo">
 *   <img src="/photo.jpg" alt="Product photo" className="w-48" />
 * </ImageLightbox>
 */

interface ImageLightboxProps {
	src: string
	alt: string
	children: React.ReactNode
	className?: string
}

export function ImageLightbox({ src, alt, children, className }: ImageLightboxProps) {
	const [open, setOpen] = useState(false)
	const [zoom, setZoom] = useState(1)
	const overlayRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (open) overlayRef.current?.focus()
	}, [open])

	const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3))
	const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5))
	const handleReset = () => setZoom(1)
	const handleClose = () => { setOpen(false); setZoom(1) }

	return (
		<>
			{/* Trigger */}
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={cn('cursor-zoom-in group relative', className)}
			>
				{children}
				{/* Hover overlay */}
				<div className="absolute inset-0 flex items-center justify-center rounded bg-black/0 transition-colors group-hover:bg-black/10">
					<ZoomIn className="size-8 text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100" />
				</div>
			</button>

			{/* Lightbox overlay */}
			{open && (
				<div
					ref={overlayRef}
					tabIndex={-1}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 outline-none"
					role="dialog"
					aria-modal="true"
					aria-label={alt}
					onKeyDown={(e) => { if (e.key === 'Escape') handleClose() }}
				>
					{/* Controls */}
					<div className="absolute right-4 top-4 z-10 flex items-center gap-2">
						<button
							type="button"
							onClick={handleZoomOut}
							className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
							aria-label="Zoom out"
						>
							<ZoomOut className="size-5" />
						</button>
						<button
							type="button"
							onClick={handleReset}
							className="rounded-full bg-white/10 px-3 py-1 text-sm text-white transition-colors hover:bg-white/20"
							aria-label="Reset zoom to 100%"
						>
							{Math.round(zoom * 100)}%
						</button>
						<button
							type="button"
							onClick={handleZoomIn}
							className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
							aria-label="Zoom in"
						>
							<ZoomIn className="size-5" />
						</button>
						<button
							type="button"
							onClick={handleClose}
							className="ml-2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
							aria-label="Close lightbox"
						>
							<X className="size-5" />
						</button>
					</div>

					{/* Image container — click backdrop to close */}
					<div
						className="flex size-full items-center justify-center overflow-auto"
						onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
					>
						<div
							className="transition-transform duration-200"
							style={{ transform: `scale(${zoom})` }}
						>
							<img
								src={src}
								alt={alt}
								className="max-h-[90vh] max-w-[95vw] object-contain"
							/>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
