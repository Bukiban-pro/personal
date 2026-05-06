"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface MeshGradientProps {
  children?: React.ReactNode
  /** Gradient blob colors */
  colors?: string[]
  /** Animation speed multiplier (lower = slower) */
  speed?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Standalone morphing mesh gradient background.
 * Unlike GradientMeshHero (which is a full hero section), this is a
 * reusable background wrapper for any content.
 *
 * @example
 * <MeshGradient className="rounded-2xl p-12">
 *   <p className="text-foreground">Any content with a lively bg</p>
 * </MeshGradient>
 *
 * // Full-page
 * <MeshGradient
 *   className="min-h-screen"
 *   colors={["oklch(0.7 0.3 150)", "oklch(0.6 0.25 240)", "oklch(0.75 0.2 30)"]}
 * />
 */
export function MeshGradient({
  children,
  colors = [
    "oklch(0.7 0.2 250)",
    "oklch(0.65 0.22 310)",
    "oklch(0.6 0.18 180)",
    "oklch(0.72 0.2 40)",
  ],
  speed = 1,
  className,
}: MeshGradientProps) {
  const baseDuration = 20 / speed

  return (
    <div className={cn("relative overflow-hidden bg-background", className)}>
      <div className="absolute inset-0" aria-hidden>
        {colors.map((color, i) => {
          const size = 50 + (i % 2) * 20
          return (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-screen blur-[80px] dark:mix-blend-normal"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                opacity: 0.5,
              }}
              animate={{
                x: [`${-20 + i * 15}%`, `${20 - i * 10}%`, `${-10 + i * 5}%`],
                y: [`${-10 + i * 10}%`, `${30 - i * 5}%`, `${-10 + i * 10}%`],
                scale: [1, 1.15, 0.95, 1],
              }}
              transition={{
                duration: baseDuration + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
