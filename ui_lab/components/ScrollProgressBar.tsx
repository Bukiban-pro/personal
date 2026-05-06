/**
 * ScrollProgress
 * Fixed top-of-page reading progress bar that fills as the user scrolls.
 * Uses motion/react useScroll — no listeners, no cleanup needed.
 *
 * Deps: motion/react
 * Usage:
 *   // Drop into app layout — no config needed
 *   <ScrollProgress />
 *
 *   // Custom color
 *   <ScrollProgress className="from-violet-500 via-pink-500 to-amber-400 h-[3px]" />
 */
"use client"

import { motion, useScroll, type MotionProps } from "motion/react"
import { cn } from "@/lib/utils"

interface ScrollProgressBarProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgressBar({ className, ref, ...props }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-linear-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className
      )}
      style={{ scaleX: scrollYProgress }}
      {...props}
    />
  )
}
