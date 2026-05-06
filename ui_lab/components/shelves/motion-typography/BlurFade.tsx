"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
interface BlurFadeProps {
  children: React.ReactNode
  /** Delay in seconds */
  delay?: number
  /** Animation duration in seconds */
  duration?: number
  /** Blur intensity in pixels */
  blur?: number
  /** Slide-up distance in pixels */
  yOffset?: number
  /** Trigger once or re-trigger on each view */
  once?: boolean
  /** IntersectionObserver margin */
  margin?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Blur + fade-in entrance animation triggered by scroll.
 * Popularized by Magic UI / Aceternity UI — the "premium" reveal effect.
 *
 * @example
 * <BlurFade delay={0.1}>
 *   <h2>Appears with blur dissolve</h2>
 * </BlurFade>
 */
export function BlurFade({
  children,
  delay = 0,
  duration = 0.5,
  blur = 10,
  yOffset = 8,
  once = true,
  margin = "0px 0px -50px 0px",
  className,
}: BlurFadeProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin })
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blur}px)`,
      }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: yOffset, filter: `blur(${blur}px)` }
      }
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
