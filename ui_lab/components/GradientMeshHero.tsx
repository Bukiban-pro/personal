"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface GradientMeshHeroProps {
  children: React.ReactNode
  /** Gradient color stops (OKLCH) */
  colors?: string[]
  /** Animation speed multiplier (default 1) */
  speed?: number
  /** Overlay opacity for readability (default 0.3) */
  overlayOpacity?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Animated mesh gradient hero background — the Stripe/Linear signature.
 * Multiple gradient blobs drift and morph slowly behind content.
 * Auto dark-mode safe with oklch colors.
 *
 * @example
 * <GradientMeshHero>
 *   <h1 className="text-5xl font-bold">Ship faster</h1>
 *   <p>Build something incredible.</p>
 * </GradientMeshHero>
 *
 * <GradientMeshHero colors={["oklch(0.7 0.25 280)", "oklch(0.6 0.3 330)", "oklch(0.8 0.2 200)"]}>
 *   <h1>Custom colors</h1>
 * </GradientMeshHero>
 */
export function GradientMeshHero({
  children,
  colors = [
    "oklch(0.65 0.25 270)",
    "oklch(0.6 0.3 330)",
    "oklch(0.75 0.2 200)",
    "oklch(0.7 0.15 140)",
  ],
  speed = 1,
  overlayOpacity = 0.3,
  className,
}: GradientMeshHeroProps) {
  const baseDuration = 20 / speed

  return (
    <section
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden bg-background",
        className,
      )}
    >
      {/* Mesh gradient blobs */}
      <div className="absolute inset-0" aria-hidden>
        {colors.map((color, i) => {
          const size = 40 + (i % 3) * 15 // 40-70%
          const xStart = 10 + (i * 25) % 80
          const yStart = 10 + ((i * 35) % 70)
          return (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                width: `${size}%`,
                height: `${size}%`,
                left: `${xStart}%`,
                top: `${yStart}%`,
                opacity: 0.6,
              }}
              animate={{
                x: [0, 80, -60, 40, 0],
                y: [0, -70, 50, -30, 0],
                scale: [1, 1.2, 0.9, 1.1, 1],
              }}
              transition={{
                duration: baseDuration + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Dim overlay for text readability */}
      <div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlayOpacity }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {children}
      </div>
    </section>
  )
}
