import { useEffect, useState } from "react"

/**
 * Subscribe to a CSS media query and track its match state.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)")
 * const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [query])

  return matches
}
