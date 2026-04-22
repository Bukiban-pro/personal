"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface TextScrambleProps {
  /** Final text to reveal */
  text: string
  /** Scramble characters */
  chars?: string
  /** Duration in ms (default 1500) */
  duration?: number
  /** Trigger scramble */
  trigger?: boolean
  /** Scramble on mount */
  playOnMount?: boolean
  /** Tag */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Text scramble/decode effect — characters cycle through random glyphs
 * before settling on the final text. The "hacker terminal" effect from
 * Awwwards sites and sci-fi UIs.
 *
 * @example
 * <TextScramble text="Welcome to the future" playOnMount className="text-3xl font-mono" />
 *
 * // Controlled trigger
 * const [go, setGo] = useState(false)
 * <TextScramble text="Decoded!" trigger={go} />
 * <button onClick={() => setGo(true)}>Decode</button>
 */
export function TextScramble({
  text,
  chars = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  duration = 1500,
  trigger = true,
  playOnMount = false,
  as: Tag = "span",
  className,
}: TextScrambleProps) {
  const [display, setDisplay] = React.useState(playOnMount ? "" : text)
  const frameRef = React.useRef<number>(0)
  const hasPlayed = React.useRef(false)

  React.useEffect(() => {
    if (!trigger) return
    if (hasPlayed.current && !playOnMount) return
    hasPlayed.current = true

    const totalFrames = Math.ceil(duration / 30) // ~30ms per frame
    let frame = 0

    const scramble = () => {
      const progress = frame / totalFrames
      const revealed = Math.floor(progress * text.length)

      const output = text
        .split("")
        .map((char, i) => {
          if (i < revealed) return char
          if (char === " ") return " "
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join("")

      setDisplay(output)
      frame++

      if (frame <= totalFrames) {
        frameRef.current = requestAnimationFrame(scramble)
      } else {
        setDisplay(text)
      }
    }

    frameRef.current = requestAnimationFrame(scramble)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, text, chars, duration, playOnMount])

  return <Tag className={cn("whitespace-pre-wrap", className)}>{display}</Tag>
}
