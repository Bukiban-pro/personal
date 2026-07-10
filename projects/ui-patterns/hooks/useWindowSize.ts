import * as React from "react"

// ── Types ──────────────────────────────────────────────────────────────
interface WindowSize {
  width: number
  height: number
}

// ── Hook ───────────────────────────────────────────────────────────────
/**
 * Tracks window width and height with debounced resize.
 *
 * @param debounce - Debounce delay in ms (default 100)
 * @returns { width, height }
 *
 * @example
 * const { width, height } = useWindowSize()
 * const isMobile = width < 768
 */
export function useWindowSize(debounce = 100): WindowSize {
  const [size, setSize] = React.useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight })
      }, debounce)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    // Initial size
    setSize({ width: window.innerWidth, height: window.innerHeight })

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [debounce])

  return size
}
