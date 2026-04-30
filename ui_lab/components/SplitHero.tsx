"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
interface SplitHeroProps {
  /** Text side content */
  children: React.ReactNode
  /** Visual side content (image, video, illustration) */
  visual: React.ReactNode
  /** Which side the text appears on */
  textSide?: "left" | "right"
  /** Vertical alignment */
  align?: "center" | "top" | "bottom"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Split-screen hero — text on one side, visual on the other.
 * Both halves animate in from opposite directions.
 * Stacks vertically on mobile. The workhorse layout for SaaS/product pages.
 *
 * @example
 * <SplitHero visual={<img src="/hero.png" alt="Product" className="size-full object-contain" />}>
 *   <h1 className="text-5xl font-bold">Build faster</h1>
 *   <p className="text-xl text-muted-foreground mt-4">
 *     Ship production-quality apps in half the time.
 *   </p>
 *   <Button size="lg" className="mt-6">Get started</Button>
 * </SplitHero>
 */
export function SplitHero({
  children,
  visual,
  textSide = "left",
  align = "center",
  className,
}: SplitHeroProps) {
  const prefersReduced = useReducedMotion()

  const alignClass = {
    center: "items-center",
    top: "items-start pt-24",
    bottom: "items-end pb-24",
  }

  const textFrom = textSide === "left" ? -40 : 40
  const visualFrom = textSide === "left" ? 40 : -40

  const textContent = (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, x: textFrom }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex flex-col justify-center px-6 md:px-12 lg:px-16"
    >
      {children}
    </motion.div>
  )

  const visualContent = (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, x: visualFrom }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="flex items-center justify-center px-6 md:px-0"
    >
      {visual}
    </motion.div>
  )

  return (
    <section
      className={cn(
        "grid min-h-screen grid-cols-1 gap-8 md:grid-cols-2",
        alignClass[align],
        className,
      )}
    >
      {textSide === "left" ? (
        <>
          {textContent}
          {visualContent}
        </>
      ) : (
        <>
          {visualContent}
          {textContent}
        </>
      )}
    </section>
  )
}
