import * as React from "react"

// ── Types ──────────────────────────────────────────────────────────────
type ColorScheme = "light" | "dark" | "no-preference"

// ── Hook ───────────────────────────────────────────────────────────────
/**
 * Detects system color scheme preference.
 * Listens for changes in real-time (e.g., macOS auto dark mode).
 *
 * @returns "light" | "dark" | "no-preference"
 *
 * @example
 * const scheme = usePrefersColorScheme()
 * // Auto-apply theme
 * useEffect(() => {
 *   document.documentElement.classList.toggle("dark", scheme === "dark")
 * }, [scheme])
 */
export function usePrefersColorScheme(): ColorScheme {
  const [scheme, setScheme] = React.useState<ColorScheme>(() => {
    if (typeof window === "undefined") return "no-preference"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  React.useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handler = (e: MediaQueryListEvent) => {
      setScheme(e.matches ? "dark" : "light")
    }

    darkQuery.addEventListener("change", handler)
    return () => darkQuery.removeEventListener("change", handler)
  }, [])

  return scheme
}
