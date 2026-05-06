"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
interface ParallaxSectionProps {
  children: React.ReactNode
  /**
   * Parallax speed multiplier.
   * - Positive = moves slower than scroll (background feel)
   * - Negative = moves opposite direction
   * - 0 = no parallax
   * Default: 0.3
   */
  speed?: number
  /** Additional y-axis offset range in pixels */
  offset?: number
  /** Parallax direction */
  direction?: "vertical" | "horizontal"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Scroll-linked parallax section using Framer Motion's useScroll + useTransform.
 * Inspired by GSAP ScrollTrigger parallax patterns from creative portfolios.
 *
 * @example
 * <ParallaxSection speed={0.5}>
 *   <img src="/hero-bg.jpg" className="w-full" />
 * </ParallaxSection>
 *
 * <ParallaxSection speed={-0.2}>
 *   <h2>Moves opposite to scroll</h2>
 * </ParallaxSection>
 */
export function ParallaxSection({
  children,
  speed = 0.3,
  offset = 100,
  direction = "vertical",
  className,
}: ParallaxSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const range = offset * speed
  const axis = direction === "vertical"
    ? { y: useTransform(scrollYProgress, [0, 1], [range, -range]) }
    : { x: useTransform(scrollYProgress, [0, 1], [range, -range]) }

  if (prefersReduced) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={axis}>
        {children}
      </motion.div>
    </div>
  )
}

// ── Parallax Image variant ─────────────────────────────────────────────
interface ParallaxImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  speed?: number
  containerClassName?: string
}

/**
 * Image with built-in parallax. Scales slightly to prevent gap.
 *
 * @example
 * <ParallaxImage src="/bg.jpg" alt="Background" speed={0.4} className="rounded-xl" />
 */
export function ParallaxImage({
  speed = 0.3,
  containerClassName,
  className,
  ...imgProps
}: ParallaxImageProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])

  if (prefersReduced) {
    return (
      <div ref={ref} className={cn("overflow-hidden", containerClassName)}>
        <img className={className} {...imgProps} />
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", containerClassName)}>
      <motion.img
        style={{ y, scale: 1.2 }}
        className={cn("object-cover", className)}
        {...imgProps}
      />
    </div>
  )
}
