/**
 * WordRotate
 * Vertically cycling words with fade-slide transitions using AnimatePresence.
 * Drop-in for hero taglines, rotating headlines.
 *
 * Deps: motion/react
 * Usage:
 *   <WordRotate
 *     words={["beautiful", "fast", "accessible"]}
 *     className="text-5xl font-bold text-primary"
 *   />
 *
 *   // Custom motion props
 *   <WordRotate
 *     words={["Design", "Build", "Ship"]}
 *     duration={3000}
 *     motionProps={{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}
 *   />
 */
"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"
import { cn } from "@/lib/utils"

interface WordRotateProps {
  words: string[]
  duration?: number
  motionProps?: MotionProps
  className?: string
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, duration)
    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.span key={words[index]} className={cn(className)} {...motionProps}>
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
