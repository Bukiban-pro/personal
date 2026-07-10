"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface HorizontalScrollSectionProps {
  children: React.ReactNode
  /** Height multiplier — how much vertical scroll space to consume (default: children count) */
  heightMultiplier?: number
  className?: string
  innerClassName?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Horizontal scroll section driven by vertical scrolling.
 * Classic Awwwards-style effect from creative portfolios.
 * Children scroll horizontally as user scrolls vertically.
 *
 * @example
 * <HorizontalScrollSection>
 *   <div className="min-w-[80vw] shrink-0 p-10">Panel 1</div>
 *   <div className="min-w-[80vw] shrink-0 p-10">Panel 2</div>
 *   <div className="min-w-[80vw] shrink-0 p-10">Panel 3</div>
 * </HorizontalScrollSection>
 */
export function HorizontalScrollSection({
  children,
  heightMultiplier,
  className,
  innerClassName,
}: HorizontalScrollSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [scrollWidth, setScrollWidth] = React.useState(0)

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setScrollWidth(el.scrollWidth - el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const childCount = React.Children.count(children)
  const sectionHeight = `${(heightMultiplier ?? childCount) * 100}vh`

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollWidth])

  return (
    <section
      ref={containerRef}
      className={cn("relative", className)}
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          ref={scrollRef}
          style={{ x }}
          className={cn("flex h-full items-center", innerClassName)}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
