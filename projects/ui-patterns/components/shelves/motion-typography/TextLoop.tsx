"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface TextLoopProps {
  /** Words/phrases to cycle through */
  words: string[]
  /** Interval in ms (default 2500) */
  interval?: number
  /** Animation type */
  animation?: "slide" | "fade" | "blur" | "morph"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Cycling text that smoothly transitions between words.
 * Inline replacement — fits inside a sentence.
 * Simpler than TextRotateHero — this is a single span, not a hero layout.
 *
 * @example
 * <p>
 *   We help you <TextLoop words={["build", "ship", "scale", "grow"]} className="font-bold text-primary" />
 *   your product.
 * </p>
 */
export function TextLoop({
  words,
  interval = 2500,
  animation = "slide",
  className,
}: TextLoopProps) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    )
    return () => clearInterval(timer)
  }, [words.length, interval])

  const variants = {
    slide: {
      initial: { y: "100%", opacity: 0 },
      animate: { y: "0%", opacity: 1 },
      exit: { y: "-100%", opacity: 0 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    blur: {
      initial: { opacity: 0, filter: "blur(6px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(6px)" },
    },
    morph: {
      initial: { opacity: 0, scale: 0.8, rotateX: 45 },
      animate: { opacity: 1, scale: 1, rotateX: 0 },
      exit: { opacity: 0, scale: 1.2, rotateX: -45 },
    },
  }

  const v = variants[animation]
  // Use longest word for layout stability
  const longest = words.reduce((a, b) => (a.length > b.length ? a : b))

  return (
    <span className={cn("relative inline-block overflow-hidden align-bottom", className)}>
      <span className="invisible">{longest}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={v.initial}
          animate={v.animate}
          exit={v.exit}
          transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="absolute inset-0"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
