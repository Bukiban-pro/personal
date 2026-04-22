"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
interface Blob {
  color: string
  size?: number
  x?: string
  y?: string
}

interface GradientBlobsProps {
  /** Array of blobs to render (2-5 recommended) */
  blobs?: Blob[]
  /** Global blur amount in pixels */
  blur?: number
  /** Animation speed multiplier (1 = default, 0 = static) */
  speed?: number
  /** Overall opacity */
  opacity?: number
  className?: string
}

// ── Defaults ───────────────────────────────────────────────────────────
const defaultBlobs: Blob[] = [
  { color: "oklch(0.7 0.25 270)", size: 400, x: "25%", y: "30%" },
  { color: "oklch(0.65 0.2 330)", size: 350, x: "65%", y: "50%" },
  { color: "oklch(0.75 0.15 200)", size: 300, x: "45%", y: "70%" },
]

// ── Component ──────────────────────────────────────────────────────────
/**
 * Animated gradient blob/orb background.
 * The organic floating blobs seen on hero sections of Stripe, Vercel, Apple.
 *
 * @example
 * <div className="relative h-screen">
 *   <GradientBlobs />
 *   <div className="relative z-10">Hero content</div>
 * </div>
 *
 * <GradientBlobs
 *   blobs={[
 *     { color: "oklch(0.7 0.3 150)", size: 500 },
 *     { color: "oklch(0.6 0.25 280)", size: 400, x: "70%", y: "60%" },
 *   ]}
 * />
 */
export function GradientBlobs({
  blobs = defaultBlobs,
  blur = 80,
  speed = 1,
  opacity = 0.4,
  className,
}: GradientBlobsProps) {
  const prefersReduced = useReducedMotion()
  const duration = 20 / speed

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ filter: `blur(${blur}px)`, opacity }}
      aria-hidden
    >
      {blobs.map((blob, i) => {
        const size = blob.size ?? 350

        if (prefersReduced) {
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: blob.x ?? "50%",
                top: blob.y ?? "50%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
              }}
            />
          )
        }

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            }}
            animate={{
              x: [blob.x ?? "0%", `calc(${blob.x ?? "50%"} + 40px)`, `calc(${blob.x ?? "50%"} - 30px)`, blob.x ?? "0%"],
              y: [blob.y ?? "0%", `calc(${blob.y ?? "50%"} - 50px)`, `calc(${blob.y ?? "50%"} + 40px)`, blob.y ?? "0%"],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: duration + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}
