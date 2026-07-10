import * as React from "react"

// ── Hook ───────────────────────────────────────────────────────────────
/**
 * Tracks hover state for a given ref.
 * Returns [ref, isHovered]. Attach ref to any element.
 *
 * @example
 * const [ref, isHovered] = useHover<HTMLDivElement>()
 * <div ref={ref} className={cn("transition", isHovered && "bg-accent")}>
 *   {isHovered ? "Over me!" : "Hover me"}
 * </div>
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
] {
  const ref = React.useRef<T>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const onEnter = () => setIsHovered(true)
    const onLeave = () => setIsHovered(false)

    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return [ref, isHovered]
}
