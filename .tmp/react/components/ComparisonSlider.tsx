"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface ComparisonSliderProps {
  /** "Before" image URL */
  beforeSrc: string
  /** "After" image URL */
  afterSrc: string
  /** Before label */
  beforeLabel?: string
  /** After label */
  afterLabel?: string
  /** Initial slider position (0-100) */
  initialPosition?: number
  /** Alt text for images */
  beforeAlt?: string
  afterAlt?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Before/after image comparison slider.
 * Drag the handle to reveal the before/after images.
 * Used for design showcases, photo editing, AI generation comparisons.
 *
 * @example
 * <ComparisonSlider
 *   beforeSrc="/before.jpg"
 *   afterSrc="/after.jpg"
 *   beforeLabel="Before"
 *   afterLabel="After"
 *   className="aspect-video max-w-2xl"
 * />
 */
export function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  initialPosition = 50,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
}: ComparisonSliderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState(initialPosition)
  const [isDragging, setIsDragging] = React.useState(false)

  const updatePosition = React.useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setPosition(pct)
  }, [])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX)
  }

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX)
    const handleMouseUp = () => setIsDragging(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, updatePosition])

  // Touch events
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative cursor-col-resize select-none overflow-hidden rounded-xl",
        className,
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
      onTouchMove={handleTouchMove}
      role="slider"
      aria-label="Image comparison"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* After (base layer) */}
      <img
        src={afterSrc}
        alt={afterAlt}
        className="block size-full object-cover"
        draggable={false}
      />

      {/* Before (clipped overlay) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="size-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 z-10 h-full w-0.5 bg-foreground shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <div className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-foreground bg-background/80 shadow-lg backdrop-blur-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground">
            <path d="M5 3L2 8L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3L14 8L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      {beforeLabel && (
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {beforeLabel}
        </span>
      )}
      {afterLabel && (
        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {afterLabel}
        </span>
      )}
    </div>
  )
}
