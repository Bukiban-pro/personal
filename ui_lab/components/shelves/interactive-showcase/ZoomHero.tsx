"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface ZoomHeroProps {
  children: React.ReactNode
  /** Starting scale (default 0.5) */
  startScale?: number
  /** Starting border radius (default "24px") */
  startRadius?: string
  /** Scroll length in vh (default 2) */
  scrollLength?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Hero section that scales from a small card to fullscreen as the user scrolls.
 * The cinematic "zoom into the experience" effect from Apple, Linear, Vercel.
 *
 * @example
 * <ZoomHero startScale={0.4}>
 *   <img src="/hero.jpg" alt="Hero" className="size-full object-cover" />
 * </ZoomHero>
 *
 * <ZoomHero startScale={0.6} startRadius="32px">
 *   <video src="/intro.mp4" autoPlay muted loop className="size-full object-cover" />
 * </ZoomHero>
 */
export function ZoomHero({
  children,
  startScale = 0.5,
  startRadius = "24px",
  scrollLength = 2,
  className,
}: ZoomHeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [startScale, 1])
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 1],
    [startRadius, "0px"],
  )
  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0.6])

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ scale, borderRadius, opacity }}
          className={cn(
            "mx-auto h-screen origin-center overflow-hidden",
            className,
          )}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
