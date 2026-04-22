"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
type RevealDirection = "left" | "right" | "up" | "down"

interface ImageRevealProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Direction the mask reveals from */
  direction?: RevealDirection
  /** Reveal animation duration (seconds) */
  duration?: number
  /** Delay before reveal starts (seconds) */
  delay?: number
  /** Trigger once */
  once?: boolean
  /** Container className */
  containerClassName?: string
}

// ── Clip paths ─────────────────────────────────────────────────────────
const clipPaths: Record<RevealDirection, { hidden: string; visible: string }> = {
  left: {
    hidden: "inset(0 100% 0 0)",
    visible: "inset(0 0% 0 0)",
  },
  right: {
    hidden: "inset(0 0 0 100%)",
    visible: "inset(0 0 0 0%)",
  },
  up: {
    hidden: "inset(100% 0 0 0)",
    visible: "inset(0% 0 0 0)",
  },
  down: {
    hidden: "inset(0 0 100% 0)",
    visible: "inset(0 0 0% 0)",
  },
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Image with clip-path reveal animation on scroll.
 * The cinematic image entrance used in portfolio project showcases.
 *
 * @example
 * <ImageReveal src="/project.jpg" alt="Project" direction="left" />
 * <ImageReveal src="/hero.jpg" alt="Hero" direction="up" duration={1} />
 */
export function ImageReveal({
  direction = "left",
  duration = 0.8,
  delay = 0,
  once = true,
  containerClassName,
  className,
  ...imgProps
}: ImageRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: "0px 0px -60px 0px" })
  const prefersReduced = useReducedMotion()

  const { hidden, visible } = clipPaths[direction]

  if (prefersReduced) {
    return (
      <div ref={ref} className={containerClassName}>
        <img className={className} {...imgProps} />
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", containerClassName)}>
      <motion.div
        initial={{ clipPath: hidden }}
        animate={inView ? { clipPath: visible } : { clipPath: hidden }}
        transition={{
          duration,
          delay,
          ease: [0.77, 0, 0.175, 1],
        }}
      >
        <motion.img
          initial={{ scale: 1.3 }}
          animate={inView ? { scale: 1 } : { scale: 1.3 }}
          transition={{
            duration: duration * 1.5,
            delay,
            ease: [0.77, 0, 0.175, 1],
          }}
          className={cn("size-full object-cover", className)}
          {...imgProps}
        />
      </motion.div>
    </div>
  )
}
