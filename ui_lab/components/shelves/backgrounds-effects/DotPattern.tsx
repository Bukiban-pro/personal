'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface DotPatternProps extends React.SVGAttributes<SVGSVGElement> {
  /** Dot spacing */
  spacing?: number
  /** Dot radius */
  radius?: number
  /** Dot color (design token safe) */
  color?: string
  /** Radial fade from center (vignette) */
  fade?: boolean
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * SVG dot grid background pattern.
 * Inspired by Magic UI's DotPattern — the subtle background seen on
 * Linear, Vercel, and countless creative landing pages.
 *
 * @example
 * <div className="relative h-96">
 *   <DotPattern fade className="absolute inset-0 opacity-40" />
 *   <div className="relative z-10">Content on dots</div>
 * </div>
 */
export function DotPattern({
  spacing = 20,
  radius = 1,
  color = "currentColor",
  fade = false,
  className,
  ...props
}: DotPatternProps) {
  const id = React.useId()
  const patternId = `dot-pattern-${id}`
  const maskId = `dot-mask-${id}`

  return (
    <svg
      className={cn("pointer-events-none size-full", className)}
      aria-hidden
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          x={0}
          y={0}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={spacing / 2} cy={spacing / 2} r={radius} fill={color} />
        </pattern>
        {fade && (
          <radialGradient id={maskId}>
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
        )}
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={fade ? `url(#${maskId}-mask)` : undefined}
      />
      {fade && (
        <mask id={`${maskId}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${maskId})`} />
        </mask>
      )}
    </svg>
  )
}
