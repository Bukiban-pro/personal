"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface FlipCardProps {
  /** Front face content */
  front: React.ReactNode
  /** Back face content */
  back: React.ReactNode
  /** Flip trigger */
  trigger?: "hover" | "click"
  /** Flip direction */
  direction?: "horizontal" | "vertical"
  /** Card dimensions */
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * 3D flip card with front and back faces.
 * Flips on hover or click. CSS 3D transforms for performance.
 * Used for team member cards, feature reveals, game cards.
 *
 * @example
 * <FlipCard
 *   className="h-64 w-48"
 *   front={<div className="flex items-center justify-center bg-primary text-primary-foreground h-full rounded-xl">Front</div>}
 *   back={<div className="flex items-center justify-center bg-secondary h-full rounded-xl">Back</div>}
 * />
 */
export function FlipCard({
  front,
  back,
  trigger = "hover",
  direction = "horizontal",
  className,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  const rotateAxis = direction === "horizontal" ? "rotateY" : "rotateX"
  const flipAngle = isFlipped ? 180 : 0

  const handlers =
    trigger === "hover"
      ? {
          onMouseEnter: () => setIsFlipped(true),
          onMouseLeave: () => setIsFlipped(false),
        }
      : {
          onClick: () => setIsFlipped((f) => !f),
        }

  return (
    <div
      className={cn("relative cursor-pointer", className)}
      style={{ perspective: "1000px" }}
      {...handlers}
    >
      <motion.div
        animate={{ [rotateAxis]: flipAngle }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative size-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: `${rotateAxis === "rotateY" ? "rotateY(180deg)" : "rotateX(180deg)"}`,
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
