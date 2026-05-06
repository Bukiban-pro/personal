"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface InteractiveGridProps {
  /** Grid items */
  children: React.ReactNode
  /** Columns */
  columns?: number
  /** Proximity radius in px */
  radius?: number
  /** Max scale when mouse is close */
  maxScale?: number
  /** Gap in rem */
  gap?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Grid where cells react to mouse proximity.
 * The macOS Dock magnification effect applied to a grid layout.
 * Cells scale up when the cursor is near, creating a "breathing" effect.
 *
 * @example
 * <InteractiveGrid columns={4} radius={150}>
 *   {icons.map(icon => (
 *     <div key={icon.id} className="flex aspect-square items-center justify-center rounded-xl bg-card border border-border">
 *       {icon.element}
 *     </div>
 *   ))}
 * </InteractiveGrid>
 */
export function InteractiveGrid({
  children,
  columns = 4,
  radius = 150,
  maxScale = 1.15,
  gap = 1,
  className,
}: InteractiveGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovering, setIsHovering] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const items = React.Children.toArray(children)

  return (
    <div
      ref={containerRef}
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}rem`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {items.map((child, i) => (
        <GridCell
          key={i}
          mouseX={mouseX}
          mouseY={mouseY}
          radius={radius}
          maxScale={maxScale}
          isHovering={isHovering}
        >
          {child}
        </GridCell>
      ))}
    </div>
  )
}

// ── GridCell ────────────────────────────────────────────────────────────
function GridCell({
  children,
  mouseX,
  mouseY,
  radius,
  maxScale,
  isHovering,
}: {
  children: React.ReactNode
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  radius: number
  maxScale: number
  isHovering: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [center, setCenter] = React.useState({ x: 0, y: 0 })

  // Recalculate center on layout changes
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      const parentRect = el.offsetParent?.getBoundingClientRect()
      if (parentRect) {
        setCenter({
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top + rect.height / 2,
        })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const distance = useTransform([mouseX, mouseY], ([mx, my]) => {
    if (!isHovering) return radius + 1 // No scaling
    const dx = (mx as number) - center.x
    const dy = (my as number) - center.y
    return Math.sqrt(dx * dx + dy * dy)
  })

  const scale = useTransform(distance, [0, radius], [maxScale, 1])

  return (
    <motion.div
      ref={ref}
      style={{ scale: isHovering ? scale : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}
