import * as React from "react"

// ── Types ──────────────────────────────────────────────────────────────
type SplitMode = "words" | "characters" | "lines"

interface SplitResult {
  /** Array of split elements */
  elements: string[]
  /** The original text */
  original: string
  /** Wrapper props to apply to each element */
  getElementProps: (index: number) => {
    key: string
    style: React.CSSProperties
    "aria-hidden": true
  }
}

// ── Utility ────────────────────────────────────────────────────────────
/**
 * Split text into words, characters, or lines for animation.
 * Returns structured data ready for Framer Motion / CSS animation.
 *
 * @example
 * const { elements, getElementProps } = splitText("Hello World", "characters")
 * elements.map((char, i) => (
 *   <motion.span {...getElementProps(i)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 *     {char}
 *   </motion.span>
 * ))
 */
export function splitText(text: string, mode: SplitMode = "words"): SplitResult {
  let elements: string[]

  switch (mode) {
    case "characters":
      elements = text.split("").map((c) => (c === " " ? "\u00A0" : c))
      break
    case "lines":
      elements = text.split("\n").filter(Boolean)
      break
    case "words":
    default:
      elements = text.split(/(\s+)/).filter((s) => s.trim().length > 0)
      break
  }

  return {
    elements,
    original: text,
    getElementProps: (index: number) => ({
      key: `${mode}-${index}`,
      style: { display: "inline-block" },
      "aria-hidden": true as const,
    }),
  }
}

// ── React Hook ─────────────────────────────────────────────────────────
/**
 * Hook version of splitText for use in components.
 *
 * @example
 * const { elements, getElementProps } = useSplitText("Hello World", "words")
 */
export function useSplitText(text: string, mode: SplitMode = "words") {
  return React.useMemo(() => splitText(text, mode), [text, mode])
}
