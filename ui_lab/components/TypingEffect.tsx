"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface TypingEffectProps {
  /** Text to type out */
  text: string
  /** Typing speed in ms per character */
  speed?: number
  /** Delay before starting (ms) */
  delay?: number
  /** Whether to show a blinking cursor */
  cursor?: boolean
  /** Cursor character */
  cursorChar?: string
  /** Start typing when component mounts */
  autoStart?: boolean
  /** Called when typing completes */
  onComplete?: () => void
  className?: string
  cursorClassName?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Zero-dependency typewriter effect. Unlike AnimatedText (which uses
 * react-simple-typewriter), this is standalone and more controllable.
 *
 * @example
 * <TypingEffect text="Hello, I'm a developer." speed={60} />
 * <TypingEffect text="Building the future." cursor cursorChar="|" />
 */
export function TypingEffect({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "▊",
  autoStart = true,
  onComplete,
  className,
  cursorClassName,
}: TypingEffectProps) {
  const [displayed, setDisplayed] = React.useState("")
  const [started, setStarted] = React.useState(false)
  const [complete, setComplete] = React.useState(false)

  // Delay before starting
  React.useEffect(() => {
    if (!autoStart) return
    const id = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(id)
  }, [autoStart, delay])

  // Typing loop
  React.useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) {
      setComplete(true)
      onComplete?.()
      return
    }

    const id = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)

    return () => clearTimeout(id)
  }, [started, displayed, text, speed, onComplete])

  // Reset when text changes
  React.useEffect(() => {
    setDisplayed("")
    setComplete(false)
    setStarted(false)
    if (autoStart) {
      const id = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(id)
    }
  }, [text, autoStart, delay])

  return (
    <span className={cn(className)} aria-label={text}>
      <span aria-hidden>{displayed}</span>
      {cursor && (
        <span
          className={cn(
            "ml-0.5 inline-block",
            complete ? "animate-pulse" : "animate-blink",
            cursorClassName,
          )}
          aria-hidden
        >
          {cursorChar}
        </span>
      )}
    </span>
  )
}
