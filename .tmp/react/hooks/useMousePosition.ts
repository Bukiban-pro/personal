import * as React from "react"

// ── Types ──────────────────────────────────────────────────────────────
interface MousePosition {
  x: number
  y: number
}

interface UseMousePositionOptions {
  /** Track relative to an element instead of the window */
  ref?: React.RefObject<HTMLElement | null>
  /** Whether to normalize to 0-1 range */
  normalize?: boolean
}

// ── Hook ───────────────────────────────────────────────────────────────
/**
 * Track mouse position on the window or relative to an element.
 *
 * @example
 * // Global mouse position
 * const { x, y } = useMousePosition()
 *
 * // Relative to element, normalized 0-1
 * const ref = useRef(null)
 * const { x, y } = useMousePosition({ ref, normalize: true })
 * // x: 0 = left edge, 1 = right edge
 */
export function useMousePosition(options: UseMousePositionOptions = {}): MousePosition {
  const { ref, normalize = false } = options
  const [position, setPosition] = React.useState<MousePosition>({ x: 0, y: 0 })

  React.useEffect(() => {
    const target = ref?.current ?? window

    const handler = (event: Event) => {
      const e = event as MouseEvent
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setPosition(
          normalize
            ? { x: Math.min(Math.max(x / rect.width, 0), 1), y: Math.min(Math.max(y / rect.height, 0), 1) }
            : { x, y },
        )
      } else {
        setPosition(
          normalize
            ? { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
            : { x: e.clientX, y: e.clientY },
        )
      }
    }

    target.addEventListener("mousemove", handler, { passive: true })
    return () => target.removeEventListener("mousemove", handler)
  }, [ref, normalize])

  return position
}
