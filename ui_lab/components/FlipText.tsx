"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface FlipTextProps {
  /** Text to display with flip animation */
  text: string
  /** Stagger delay between characters (seconds) */
  stagger?: number
  /** Duration per character flip */
  duration?: number
  /** Tag */
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Text where each character flips in with 3D rotation.
 * The cinematic title reveal from Awwwards-winning portfolio sites.
 *
 * @example
 * <FlipText text="Hello World" className="text-5xl font-bold" />
 *
 * <FlipText text="Welcome" stagger={0.05} duration={0.5} as="h1" />
 */
export function FlipText({
  text,
  stagger = 0.03,
  duration = 0.4,
  as: Tag = "span",
  className,
}: FlipTextProps) {
  return (
    <Tag className={cn("inline-flex flex-wrap", className)} style={{ perspective: "800px" }}>
      <AnimatePresence>
        {text.split("").map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{
              duration,
              delay: i * stagger,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="inline-block origin-bottom"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </Tag>
  )
}
