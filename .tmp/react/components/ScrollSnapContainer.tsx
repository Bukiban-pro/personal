"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface ScrollSnapContainerProps {
  children: React.ReactNode
  /** Snap alignment */
  snapAlign?: "start" | "center" | "end"
  /** Show dot indicators */
  showIndicators?: boolean
  /** Indicator position */
  indicatorPosition?: "right" | "left" | "bottom"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Full-viewport scroll snap container with optional dot indicators.
 * Each child becomes a full-screen snap section. The native CSS-only
 * full-page scroll effect used on Stripe, Apple, and Awwwards sites.
 *
 * @example
 * <ScrollSnapContainer showIndicators>
 *   <section className="bg-blue-500">Page 1</section>
 *   <section className="bg-green-500">Page 2</section>
 *   <section className="bg-purple-500">Page 3</section>
 * </ScrollSnapContainer>
 */
export function ScrollSnapContainer({
  children,
  snapAlign = "start",
  showIndicators = false,
  indicatorPosition = "right",
  className,
}: ScrollSnapContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const items = React.Children.toArray(children)

  // Track active section via IntersectionObserver
  React.useEffect(() => {
    const container = containerRef.current
    if (!container || !showIndicators) return

    const sections = container.querySelectorAll("[data-snap-section]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-snap-index"))
            if (!Number.isNaN(idx)) setActiveIndex(idx)
          }
        })
      },
      { root: container, threshold: 0.6 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [showIndicators, items.length])

  const scrollTo = (index: number) => {
    const container = containerRef.current
    if (!container) return
    const section = container.querySelector(`[data-snap-index="${index}"]`)
    section?.scrollIntoView({ behavior: "smooth" })
  }

  const indicatorClass = {
    right: "right-4 top-1/2 -translate-y-1/2 flex-col",
    left: "left-4 top-1/2 -translate-y-1/2 flex-col",
    bottom: "bottom-6 left-1/2 -translate-x-1/2 flex-row",
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          "h-screen snap-y snap-mandatory overflow-y-auto",
          className,
        )}
      >
        {items.map((child, i) => (
          <div
            key={i}
            data-snap-section
            data-snap-index={i}
            className={cn(
              "flex h-screen w-full items-center justify-center",
              snapAlign === "start" && "snap-start",
              snapAlign === "center" && "snap-center",
              snapAlign === "end" && "snap-end",
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {showIndicators && (
        <nav
          className={cn(
            "fixed z-50 flex gap-2",
            indicatorClass[indicatorPosition],
          )}
          aria-label="Scroll sections"
        >
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to section ${i + 1}`}
              aria-current={activeIndex === i ? "true" : undefined}
              className={cn(
                "size-2.5 rounded-full transition-all duration-300",
                activeIndex === i
                  ? "scale-125 bg-foreground"
                  : "bg-foreground/30 hover:bg-foreground/50",
              )}
            />
          ))}
        </nav>
      )}
    </div>
  )
}
