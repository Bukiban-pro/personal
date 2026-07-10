"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface HighlightOnScrollProps {
  /** The text content to highlight */
  text: string
  /** Highlighted text color (default: foreground) */
  highlightColor?: string
  /** Unhighlighted text color (default: muted-foreground at 30% opacity) */
  dimColor?: string
  /** Tag to render */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Apple-style text where words highlight/illuminate one by one as the user scrolls.
 * Each word transitions from dim → bright as scroll progress advances.
 * The "reading progress" effect from Apple product pages and Stripe.
 *
 * @example
 * <HighlightOnScroll
 *   text="Every detail has been carefully considered. Every interaction has been thoughtfully designed."
 *   className="text-3xl font-bold max-w-2xl"
 * />
 */
export function HighlightOnScroll({
  text,
  highlightColor = "var(--foreground)",
  dimColor = "oklch(from var(--foreground) l c h / 20%)",
  as: Tag = "p",
  className,
}: HighlightOnScrollProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const words = text.split(/\s+/)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  })

  return (
    <div ref={containerRef}>
      <Tag className={cn("flex flex-wrap", className)}>
        {words.map((word, i) => {
          // Each word gets a slice of the total scroll progress
          const start = i / words.length
          const end = (i + 1) / words.length
          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
              highlightColor={highlightColor}
              dimColor={dimColor}
            />
          )
        })}
      </Tag>
    </div>
  )
}

// ── Word ───────────────────────────────────────────────────────────────
function Word({
  word,
  progress,
  range,
  highlightColor,
  dimColor,
}: {
  word: string
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  range: [number, number]
  highlightColor: string
  dimColor: string
}) {
  const color = useTransform(progress, range, [dimColor, highlightColor])

  return (
    <motion.span style={{ color }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  )
}
