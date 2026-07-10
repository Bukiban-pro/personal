"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface ScrollPinSectionProps {
  children: React.ReactNode
  /** How many viewport-heights the pinned section occupies for scroll (default 3) */
  scrollLength?: number
  className?: string
}

interface PinFrameProps {
  /** Progress range when this frame is visible [start, end] (0-1) */
  range: [number, number]
  children: React.ReactNode
  className?: string
}

// ── ScrollPinSection ───────────────────────────────────────────────────
/**
 * Apple-style scroll-pinned section.
 * The section stays fixed in the viewport while content frames animate
 * in/out based on scroll progress. The hero technique for product pages.
 *
 * @example
 * <ScrollPinSection scrollLength={4}>
 *   <PinFrame range={[0, 0.33]}>
 *     <h2>Feature One</h2>
 *   </PinFrame>
 *   <PinFrame range={[0.33, 0.66]}>
 *     <h2>Feature Two</h2>
 *   </PinFrame>
 *   <PinFrame range={[0.66, 1]}>
 *     <h2>Feature Three</h2>
 *   </PinFrame>
 * </ScrollPinSection>
 */
export function ScrollPinSection({
  children,
  scrollLength = 3,
  className,
}: ScrollPinSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div
        className={cn(
          "sticky top-0 flex h-screen items-center justify-center overflow-hidden",
          className,
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<PinFrameProps>(child)) {
            return React.cloneElement(child, {
              ...child.props,
              // @ts-expect-error internal prop injection
              __progress: scrollYProgress,
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

// ── PinFrame ───────────────────────────────────────────────────────────
/**
 * A content frame within ScrollPinSection. Visible during its scroll range.
 */
export function PinFrame({
  range,
  children,
  className,
  ...props
}: PinFrameProps & { __progress?: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  // @ts-expect-error injected by parent
  const progress = props.__progress

  // Fade in during first 20% of range, full during middle, fade out during last 20%
  const rangeLen = range[1] - range[0]
  const fadeIn = range[0] + rangeLen * 0.15
  const fadeOut = range[1] - rangeLen * 0.15

  const opacity = useTransform(
    progress,
    [range[0], fadeIn, fadeOut, range[1]],
    [0, 1, 1, 0],
  )
  const y = useTransform(
    progress,
    [range[0], fadeIn, fadeOut, range[1]],
    [30, 0, 0, -30],
  )
  const scale = useTransform(
    progress,
    [range[0], fadeIn, fadeOut, range[1]],
    [0.95, 1, 1, 0.95],
  )

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={cn("absolute inset-0 flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  )
}
