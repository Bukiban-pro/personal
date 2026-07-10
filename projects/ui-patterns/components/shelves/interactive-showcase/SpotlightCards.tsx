"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface SpotlightCardsProps {
  children: React.ReactNode
  /** Grid columns */
  columns?: 2 | 3 | 4
  /** How much siblings dim on hover (0-1) */
  dimAmount?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Card grid where hovering one card dims all siblings.
 * The "spotlight focus" pattern from Stripe and Linear marketing pages.
 * Forces attention on the hovered card by reducing others to ~30% opacity.
 *
 * @example
 * <SpotlightCards columns={3}>
 *   <Card>Feature 1</Card>
 *   <Card>Feature 2</Card>
 *   <Card>Feature 3</Card>
 * </SpotlightCards>
 */
export function SpotlightCards({
  children,
  columns = 3,
  dimAmount = 0.3,
  className,
}: SpotlightCardsProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const items = React.Children.toArray(children)

  const colClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div
      className={cn("grid gap-6", colClass[columns], className)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          animate={{
            opacity: hoveredIndex === null || hoveredIndex === i ? 1 : dimAmount,
            scale: hoveredIndex === i ? 1.02 : 1,
          }}
          transition={{ duration: 0.25 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
