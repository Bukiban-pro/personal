"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
type AnimationPreset =
  | "blurIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "fadeIn"

interface TextRevealProps {
  /** The text to animate */
  text: string
  /** Split mode: per word or per character */
  splitBy?: "word" | "character"
  /** Animation preset */
  preset?: AnimationPreset
  /** Stagger delay between each word/character (seconds) */
  stagger?: number
  /** Initial delay before animation starts (seconds) */
  delay?: number
  /** Animation duration per element (seconds) */
  duration?: number
  /** Trigger once or re-trigger on scroll */
  once?: boolean
  /** HTML element to render as */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
  className?: string
}

// ── Presets ─────────────────────────────────────────────────────────────
const presets: Record<AnimationPreset, { hidden: Record<string, unknown>; visible: Record<string, unknown> }> = {
  blurIn: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 8 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Word-by-word or character-by-character text reveal animation.
 * Inspired by creative portfolio repos and Magic UI's TextAnimate.
 *
 * @example
 * <TextReveal text="Building the future" preset="blurIn" splitBy="word" />
 * <TextReveal text="Hello World" preset="slideUp" splitBy="character" as="h1" />
 */
export function TextReveal({
  text,
  splitBy = "word",
  preset = "blurIn",
  stagger = 0.05,
  delay = 0,
  duration = 0.4,
  once = true,
  as: Component = "p",
  className,
}: TextRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: "0px 0px -40px 0px" })
  const prefersReduced = useReducedMotion()

  const elements = React.useMemo(() => {
    if (splitBy === "character") {
      return text.split("").map((char, i) => ({
        key: `${char}-${i}`,
        content: char === " " ? "\u00A0" : char,
      }))
    }
    return text.split(" ").map((word, i) => ({
      key: `${word}-${i}`,
      content: word,
    }))
  }, [text, splitBy])

  const { hidden, visible } = presets[preset]
  const MotionComponent = motion.create(Component)

  if (prefersReduced) {
    return <Component className={className}>{text}</Component>
  }

  return (
    <MotionComponent
      ref={ref}
      className={cn("flex flex-wrap", className)}
      aria-label={text}
    >
      {elements.map((el, i) => (
        <motion.span
          key={el.key}
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className={cn(splitBy === "word" && "mr-[0.25em]")}
          aria-hidden
        >
          {el.content}
        </motion.span>
      ))}
    </MotionComponent>
  )
}
