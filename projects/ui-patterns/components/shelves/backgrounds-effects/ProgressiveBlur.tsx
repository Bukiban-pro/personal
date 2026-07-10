/**
 * ProgressiveBlur
 * Adds a stacked backdrop-blur gradient fade to the top/bottom/both edges of
 * scrollable content, creating a premium "content fades into blur" effect.
 * No deps — pure CSS via inline styles.
 *
 * Usage:
 *   <div className="relative overflow-y-auto h-64">
 *     <p>Long content...</p>
 *     <ProgressiveBlur position="bottom" height="30%" />
 *   </div>
 *
 *   // Both edges
 *   <ProgressiveBlur position="both" />
 */
"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface ProgressiveBlurProps {
  className?: string
  /** Height of the blur zone. Ignored when position="both" (fills full height). */
  height?: string
  position?: "top" | "bottom" | "both"
  /** Blur levels per stacked layer (px). Length determines number of layers. */
  blurLevels?: number[]
}

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
}: ProgressiveBlurProps) {
  const divElements = Array(blurLevels.length - 2).fill(null)

  const getMask = (
    dir: "bottom" | "top" | "both",
    startPct: number,
    midPct: number,
    endPct: number
  ) => {
    if (dir === "bottom")
      return `linear-gradient(to bottom, rgba(0,0,0,0) ${startPct}%, rgba(0,0,0,1) ${midPct}%, rgba(0,0,0,1) ${endPct}%, rgba(0,0,0,0) ${endPct + 12.5}%)`
    if (dir === "top")
      return `linear-gradient(to top, rgba(0,0,0,0) ${startPct}%, rgba(0,0,0,1) ${midPct}%, rgba(0,0,0,1) ${endPct}%, rgba(0,0,0,0) ${endPct + 12.5}%)`
    return `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`
  }

  return (
    <div
      className={cn(
        "gradient-blur pointer-events-none absolute inset-x-0 z-10",
        position === "top" ? "top-0" : position === "bottom" ? "bottom-0" : "inset-y-0",
        className
      )}
      style={{ height: position === "both" ? "100%" : height }}
    >
      {/* First blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: getMask(position, 0, 12.5, 25),
          WebkitMaskImage: getMask(position, 0, 12.5, 25),
        }}
      />

      {/* Middle layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1
        const startPercent = blurIndex * 12.5
        const midPercent = (blurIndex + 1) * 12.5
        const endPercent = (blurIndex + 2) * 12.5
        const maskGradient = getMask(position, startPercent, midPercent, endPercent)

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        )
      })}

      {/* Last blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          maskImage:
            position === "bottom"
              ? "linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
              : position === "top"
                ? "linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
                : "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            position === "bottom"
              ? "linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
              : position === "top"
                ? "linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
                : "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  )
}
