import * as React from "react"

// ── Types ──────────────────────────────────────────────────────────────
type ScrollDirection = "up" | "down" | null

// ── Hook ───────────────────────────────────────────────────────────────
/**
 * Detects scroll direction (up/down).
 * Useful for hiding/showing nav bars on scroll, or triggering
 * direction-aware animations.
 *
 * @param threshold - Minimum scroll delta to trigger a direction change (default 5px)
 * @returns "up" | "down" | null
 *
 * @example
 * const direction = useScrollDirection()
 * // Hide nav on scroll down
 * <nav className={cn("sticky top-0 transition-transform", direction === "down" && "-translate-y-full")} />
 */
export function useScrollDirection(threshold = 5): ScrollDirection {
  const [direction, setDirection] = React.useState<ScrollDirection>(null)
  const lastY = React.useRef(0)
  const ticking = React.useRef(false)

  React.useEffect(() => {
    lastY.current = window.scrollY

    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY.current

        if (Math.abs(delta) >= threshold) {
          setDirection(delta > 0 ? "down" : "up")
          lastY.current = y
        }

        ticking.current = false
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])

  return direction
}
