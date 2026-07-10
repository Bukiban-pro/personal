"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface SpotlightProps {
  children: React.ReactNode
  /** Spotlight radius in pixels */
  size?: number
  /** Spotlight color */
  color?: string
  /** Spotlight opacity */
  opacity?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Container with a radial gradient spotlight that follows the cursor.
 * Inspired by Magic UI's Magic Card / Spotlight effect.
 *
 * @example
 * <Spotlight className="rounded-xl border border-border bg-card p-8">
 *   <h3>Hover for spotlight</h3>
 * </Spotlight>
 */
export function Spotlight({
  children,
  size = 300,
  color = "oklch(0.7 0.15 270)",
  opacity = 0.12,
  className,
}: SpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${color} 0%, transparent 70%)`,
          mixBlendMode: "soft-light",
          ...(opacity !== undefined && { opacity: isHovered ? opacity : 0 }),
        }}
        aria-hidden
      />
      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}
