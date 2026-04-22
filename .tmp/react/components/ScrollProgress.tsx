"use client"

import * as React from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface ScrollProgressProps {
  /** Position of the progress bar */
  position?: "top" | "bottom"
  /** Bar height */
  height?: number
  /** Color (uses CSS variable by default) */
  color?: string
  /** Spring damping for smoothness */
  damping?: number
  /** Spring stiffness */
  stiffness?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Thin progress bar at the top/bottom of the page showing scroll position.
 * Common in portfolio sites and long-form content pages.
 *
 * @example
 * // Place in layout — it's fixed-position
 * <ScrollProgress />
 * <ScrollProgress position="bottom" color="oklch(0.6 0.2 270)" />
 */
export function ScrollProgress({
  position = "top",
  height = 3,
  color,
  damping = 30,
  stiffness = 200,
  className,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { damping, stiffness })

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        height,
        ...(color && { backgroundColor: color }),
      }}
      className={cn(
        "fixed left-0 right-0 z-50 bg-primary",
        position === "top" ? "top-0" : "bottom-0",
        className,
      )}
      aria-hidden
    />
  )
}
