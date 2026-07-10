"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ── Types ──────────────────────────────────────────────────────────────
interface ThemeToggleProps {
  /** Current theme */
  theme?: "light" | "dark" | "system"
  /** Callback when theme changes */
  onThemeChange?: (theme: "light" | "dark") => void
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Standalone theme toggle button.
 *
 * Usage with next-themes:
 * ```tsx
 * const { theme, setTheme } = useTheme()
 * <ThemeToggle theme={theme} onThemeChange={setTheme} />
 * ```
 *
 * Usage standalone (localStorage):
 * The component manages its own state if no props are provided.
 */
export function ThemeToggle({
  theme: externalTheme,
  onThemeChange,
  className,
}: ThemeToggleProps) {
  const [internalTheme, setInternalTheme] = React.useState<"light" | "dark">(
    "light",
  )

  // Sync with system preference on mount (standalone mode)
  React.useEffect(() => {
    if (externalTheme) return
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    if (stored) {
      setInternalTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches
      setInternalTheme(prefersDark ? "dark" : "light")
    }
  }, [externalTheme])

  const isDark =
    (externalTheme ?? internalTheme) === "dark" ||
    (externalTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggle = () => {
    const next = isDark ? "light" : "dark"
    if (onThemeChange) {
      onThemeChange(next)
    } else {
      setInternalTheme(next)
      localStorage.setItem("theme", next)
      document.documentElement.classList.toggle("dark", next === "dark")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn("size-9", className)}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
