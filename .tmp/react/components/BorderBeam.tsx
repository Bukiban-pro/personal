"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface BorderBeamProps {
  children: React.ReactNode
  /** Beam color */
  color?: string
  /** Second color for gradient beam */
  colorTo?: string
  /** Animation duration in seconds */
  duration?: number
  /** Beam size (width of the glowing dot) */
  beamSize?: number
  /** Border radius */
  borderRadius?: string
  /** Border width */
  borderWidth?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Animated gradient beam traveling along the border of an element.
 * Inspired by Magic UI's BorderBeam — the premium card highlight effect.
 *
 * @example
 * <BorderBeam className="p-8 bg-card rounded-xl">
 *   <h3>Premium card</h3>
 * </BorderBeam>
 *
 * <BorderBeam color="oklch(0.7 0.25 270)" colorTo="oklch(0.6 0.2 330)" duration={4}>
 *   <div>Custom beam colors</div>
 * </BorderBeam>
 */
export function BorderBeam({
  children,
  color = "oklch(0.7 0.2 270)",
  colorTo = "oklch(0.65 0.25 330)",
  duration = 6,
  beamSize = 80,
  borderRadius = "var(--radius-xl)",
  borderWidth = 1,
  className,
}: BorderBeamProps) {
  const id = React.useId()

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ borderRadius }}
    >
      {/* Static border */}
      <div
        className="absolute inset-0 z-0"
        style={{
          borderRadius,
          border: `${borderWidth}px solid oklch(from var(--border) l c h / 50%)`,
        }}
        aria-hidden
      />
      {/* Animated beam */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 size-full"
        aria-hidden
      >
        <rect
          rx={borderRadius}
          ry={borderRadius}
          width="100%"
          height="100%"
          fill="none"
          stroke={`url(#beam-gradient-${id})`}
          strokeWidth={borderWidth * 2}
          strokeDasharray={`${beamSize} 1000`}
          strokeLinecap="round"
          className="animate-border-beam"
          style={{
            animationDuration: `${duration}s`,
          }}
          pathLength={1000 + beamSize}
        />
        <defs>
          <linearGradient id={`beam-gradient-${id}`}>
            <stop stopColor={color} stopOpacity={0} />
            <stop offset="0.5" stopColor={color} />
            <stop offset="1" stopColor={colorTo} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}

/* Required CSS (add to globals.css):
@keyframes border-beam {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -1080;
  }
}
.animate-border-beam {
  animation: border-beam var(--duration, 6s) linear infinite;
}
*/
