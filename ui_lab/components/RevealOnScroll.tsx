"use client"

import * as React from "react"
import { motion, type Variant } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Reveal Directions ──────────────────────────────────────────────────
type Direction = "up" | "down" | "left" | "right" | "none"

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
}

// ── Props ──────────────────────────────────────────────────────────────
interface RevealOnScrollProps {
  children: React.ReactNode
  /** Slide-in direction (default: "up") */
  direction?: Direction
  /** Delay in seconds */
  delay?: number
  /** Animation duration in seconds */
  duration?: number
  /** Distance in pixels to slide (overrides default 40px) */
  distance?: number
  /** Whether to add blur effect */
  blur?: boolean
  /** Scale from value (e.g. 0.95) */
  scale?: number
  /** Trigger once or every time element enters viewport */
  once?: boolean
  /** Viewport margin (IntersectionObserver rootMargin) */
  margin?: string
  /** Amount of element visible before triggering (0-1) */
  amount?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance,
  blur = false,
  scale,
  once = true,
  margin = "0px 0px -80px 0px",
  amount = 0.2,
  className,
}: RevealOnScrollProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const offset = offsets[direction]
  const dist = distance ?? 40
  const ratio = dist / 40

  const hidden: Variant = {
    opacity: 0,
    x: offset.x * ratio,
    y: offset.y * ratio,
    ...(scale !== undefined && { scale }),
    ...(blur && { filter: "blur(8px)" }),
  }

  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(scale !== undefined && { scale: 1 }),
    ...(blur && { filter: "blur(0px)" }),
  }

  return (
    <motion.div
      initial={hidden}
      whileInView={visible}
      viewport={{ once, margin, amount }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
