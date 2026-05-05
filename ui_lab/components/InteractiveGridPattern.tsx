/**
 * InteractiveGridPattern
 * SVG grid background where individual cells highlight on mouse hover.
 * Hover state fades out over 1s; enter state transitions in 100ms.
 *
 * Deps: none
 * Usage:
 *   <div className="relative h-96 overflow-hidden">
 *     <InteractiveGridPattern className="[mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
 *   </div>
 *
 *   // Custom grid size and cell colors
 *   <InteractiveGridPattern
 *     width={60}
 *     height={60}
 *     squares={[18, 12]}
 *     squaresClassName="fill-blue-500/20 hover:fill-blue-400/40"
 *   />
 */
"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  /** Width of each cell in px @default 40 */
  width?: number
  /** Height of each cell in px @default 40 */
  height?: number
  /** [horizontal, vertical] cell count @default [24, 24] */
  squares?: [number, number]
  className?: string
  squaresClassName?: string
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn("absolute inset-0 h-full w-full border border-gray-400/30", className)}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width
        const y = Math.floor(index / horizontal) * height
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-gray-400/30 transition-all duration-100 ease-in-out not-[&:hover]:duration-1000",
              hoveredSquare === index ? "fill-gray-300/30" : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        )
      })}
    </svg>
  )
}
