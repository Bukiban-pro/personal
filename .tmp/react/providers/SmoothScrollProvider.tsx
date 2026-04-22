"use client"

import * as React from "react"

// ── Types ──────────────────────────────────────────────────────────────
interface SmoothScrollContextValue {
  /** Current scroll position (updated at rAF rate) */
  scrollY: number
  /** Programmatically scroll to a target */
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number }) => void
}

const SmoothScrollContext = React.createContext<SmoothScrollContextValue>({
  scrollY: 0,
  scrollTo: () => {},
})

export const useSmoothScroll = () => React.useContext(SmoothScrollContext)

// ── Props ──────────────────────────────────────────────────────────────
interface SmoothScrollProviderProps {
  children: React.ReactNode
  /** CSS scroll-behavior (native smooth scrolling) */
  enabled?: boolean
}

// ── Provider ───────────────────────────────────────────────────────────
/**
 * Smooth scroll wrapper provider.
 * Applies CSS `scroll-behavior: smooth` and exposes a `scrollTo` helper
 * and live `scrollY` value through context.
 *
 * For Lenis/locomotive-scroll integration, replace the internals but
 * keep the same context API — consumers won't need to change.
 *
 * @example
 * // In layout.tsx
 * <SmoothScrollProvider>
 *   <App />
 * </SmoothScrollProvider>
 *
 * // In any component
 * const { scrollTo, scrollY } = useSmoothScroll()
 * scrollTo("#about", { offset: -80 })
 */
export function SmoothScrollProvider({ children, enabled = true }: SmoothScrollProviderProps) {
  const [scrollY, setScrollY] = React.useState(0)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    // Apply smooth scroll behavior
    if (enabled) {
      document.documentElement.style.scrollBehavior = "smooth"
    }

    let rafId: number
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
      if (enabled) {
        document.documentElement.style.scrollBehavior = ""
      }
    }
  }, [enabled])

  const scrollTo = React.useCallback(
    (target: number | string | HTMLElement, options?: { offset?: number }) => {
      const offset = options?.offset ?? 0

      if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: "smooth" })
        return
      }

      const element =
        typeof target === "string" ? document.querySelector(target) : target
      if (!element) return

      const top = element.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: "smooth" })
    },
    [],
  )

  const value = React.useMemo(() => ({ scrollY, scrollTo }), [scrollY, scrollTo])

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
