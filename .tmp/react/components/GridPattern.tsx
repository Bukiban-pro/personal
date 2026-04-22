'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface GridPatternProps extends React.SVGAttributes<SVGSVGElement> {
  /** Grid cell size */
  size?: number
  /** Stroke width */
  strokeWidth?: number
  /** Stroke color */
  color?: string
  /** Highlighted cells [x, y][] that get filled */
  highlighted?: [number, number][]
  /** Fill color for highlighted cells */
  highlightColor?: string
  /** Radial fade from center */
  fade?: boolean
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * SVG grid/line background pattern with optional highlighted cells.
 * The engineering-paper / blueprint aesthetic used by Vercel, Linear.
 *
 * @example
 * <div className="relative h-96">
 *   <GridPattern
 *     fade
 *     highlighted={[[1, 2], [3, 4], [5, 1]]}
 *     className="absolute inset-0 opacity-30"
 *   />
 * </div>
 */
export function GridPattern({
  size = 40,
  strokeWidth = 1,
  color = "currentColor",
  highlighted = [],
  highlightColor = "currentColor",
  fade = false,
  className,
  ...props
}: GridPatternProps) {
  const id = React.useId()
  const patternId = `grid-pattern-${id}`
  const maskId = `grid-mask-${id}`

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
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        </pattern>
        {fade && (
          <radialGradient id={maskId}>
            <stop offset="0%" stopColor="white" />
            <stop offset="80%" stopColor="white" stopOpacity={0.5} />
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
      {/* Highlighted cells */}
      {highlighted.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x * size + 1}
          y={y * size + 1}
          width={size - 1}
          height={size - 1}
          fill={highlightColor}
          opacity={0.08}
        />
      ))}
      {fade && (
        <mask id={`${maskId}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${maskId})`} />
        </mask>
      )}
    </svg>
  )
}
