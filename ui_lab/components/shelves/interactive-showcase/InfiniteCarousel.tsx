"use client"

import * as React from "react"
import { motion, useAnimationControls } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
interface InfiniteCarouselProps {
  children: React.ReactNode
  /** Auto-scroll speed in px/s */
  speed?: number
  /** Pause on hover */
  pauseOnHover?: boolean
  /** Show navigation arrows */
  showArrows?: boolean
  /** Gap between items in px */
  gap?: number
  /** Auto-scroll direction */
  direction?: "left" | "right"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Auto-scrolling card carousel with infinite loop.
 * Richer than a simple Marquee — supports pause, arrows, and drag.
 * Duplicate items seamlessly wrap for infinite illusion.
 *
 * @example
 * <InfiniteCarousel speed={40} pauseOnHover>
 *   {logos.map(logo => (
 *     <div key={logo.id} className="flex-shrink-0 w-48 h-32 rounded-xl bg-card flex items-center justify-center">
 *       <img src={logo.src} alt={logo.name} className="h-8" />
 *     </div>
 *   ))}
 * </InfiniteCarousel>
 */
export function InfiniteCarousel({
  children,
  speed = 30,
  pauseOnHover = true,
  showArrows = false,
  gap = 16,
  direction = "left",
  className,
}: InfiniteCarouselProps) {
  const prefersReduced = useReducedMotion()
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const controls = useAnimationControls()

  const items = React.Children.toArray(children)

  // Measure track width
  React.useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setTrackWidth(el.scrollWidth / 2) // Half because we duplicate
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [items.length])

  // Animate
  React.useEffect(() => {
    if (!trackWidth || prefersReduced) return

    const duration = trackWidth / speed
    const xEnd = direction === "left" ? -trackWidth : trackWidth

    if (isPaused) {
      controls.stop()
    } else {
      controls.start({
        x: [0, xEnd],
        transition: {
          x: {
            duration,
            repeat: Infinity,
            ease: "linear",
          },
        },
      })
    }
  }, [trackWidth, speed, direction, isPaused, controls, prefersReduced])

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current?.parentElement
    if (el) {
      el.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <div
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <motion.div
          ref={trackRef}
          className="flex w-max"
          style={{ gap }}
          animate={controls}
        >
          {/* Original + duplicate for seamless loop */}
          {items.map((child, i) => (
            <div key={`a-${i}`} className="flex-shrink-0">
              {child}
            </div>
          ))}
          {items.map((child, i) => (
            <div key={`b-${i}`} className="flex-shrink-0" aria-hidden>
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => scrollBy("left")}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-accent"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-accent"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </div>
  )
}
