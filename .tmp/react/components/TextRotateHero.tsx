"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface TextRotateHeroProps {
  /** Static prefix text */
  prefix?: string
  /** Words to rotate through */
  words: string[]
  /** Static suffix text */
  suffix?: string
  /** Rotation interval in ms (default 3000) */
  interval?: number
  /** Animation style */
  animation?: "slideUp" | "fadeIn" | "blur" | "scale"
  className?: string
  wordClassName?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Hero headline with rotating/cycling words.
 * "Build [faster|better|smarter]" — the Vercel/Linear landing page pattern.
 *
 * @example
 * <TextRotateHero
 *   prefix="Build"
 *   words={["faster", "better", "smarter"]}
 *   suffix="with AI"
 *   className="text-5xl font-bold"
 *   wordClassName="text-primary"
 * />
 */
export function TextRotateHero({
  prefix,
  words,
  suffix,
  interval = 3000,
  animation = "slideUp",
  className,
  wordClassName,
}: TextRotateHeroProps) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words.length, interval])

  const variants = {
    slideUp: {
      initial: { y: 30, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -30, opacity: 0 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    blur: {
      initial: { opacity: 0, filter: "blur(8px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(8px)" },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 },
    },
  }

  const v = variants[animation]

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-[0.3em]", className)}>
      {prefix && <span>{prefix}</span>}
      <span className="relative inline-block">
        {/* Hidden spacer for layout stability */}
        <span className="invisible">
          {words.reduce((a, b) => (a.length > b.length ? a : b))}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={cn("absolute inset-0", wordClassName)}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
