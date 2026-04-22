"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ── Types ──────────────────────────────────────────────────────────────
interface ScrollToTopProps {
  /** Show button after scrolling this many pixels */
  threshold?: number
  /** Smooth scroll behavior */
  smooth?: boolean
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function ScrollToTop({
  threshold = 400,
  smooth = true,
  className,
}: ScrollToTopProps) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 size-10 rounded-full shadow-md transition-all",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
        className,
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="size-4" />
    </Button>
  )
}
