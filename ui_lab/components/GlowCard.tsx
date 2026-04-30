"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface GlowCardProps {
  children: React.ReactNode
  /** Glow color */
  color?: string
  /** Glow radius in pixels */
  radius?: number
  /** Glow intensity (0-1) */
  intensity?: number
  /** Border radius */
  borderRadius?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Card with a glowing border that follows the cursor on hover.
 * Inspired by Stripe, Linear, and Magic UI's neon gradient card.
 *
 * @example
 * <GlowCard>
 *   <div className="p-6">
 *     <h3>Premium feature</h3>
 *   </div>
 * </GlowCard>
 */
export function GlowCard({
  children,
  color = "oklch(0.65 0.25 270)",
  radius = 200,
  intensity = 0.5,
  borderRadius = "var(--radius-xl)",
  className,
}: GlowCardProps) {
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
      className={cn("group relative", className)}
      style={{ borderRadius }}
    >
      {/* Glow border effect */}
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          borderRadius,
          opacity: isHovered ? intensity : 0,
          background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${color}, transparent 70%)`,
        }}
        aria-hidden
      />
      {/* Card content with background */}
      <div
        className="relative z-10 overflow-hidden border border-border bg-card"
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  )
}
