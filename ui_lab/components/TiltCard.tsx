"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode
  /** Max tilt angle in degrees */
  maxTilt?: number
  /** Perspective distance (lower = more dramatic) */
  perspective?: number
  /** Scale on hover */
  scale?: number
  /** Glare overlay effect */
  glare?: boolean
  /** Max glare opacity */
  glareOpacity?: number
  /** Spring damping */
  damping?: number
  /** Spring stiffness */
  stiffness?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Card with interactive 3D tilt on mouse hover.
 * Inspired by creative portfolio cards and Magic UI's Magic Card.
 *
 * @example
 * <TiltCard maxTilt={15} glare>
 *   <div className="p-8">
 *     <h3>Hover for 3D effect</h3>
 *   </div>
 * </TiltCard>
 */
export function TiltCard({
  children,
  maxTilt = 10,
  perspective = 800,
  scale = 1.02,
  glare = false,
  glareOpacity = 0.15,
  damping = 20,
  stiffness = 200,
  className,
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]),
    { damping, stiffness },
  )
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]),
    { damping, stiffness },
  )

  // Glare position
  const glareX = useTransform(mouseX, [0, 1], [0, 100])
  const glareY = useTransform(mouseY, [0, 1], [0, 100])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
      style={{
        perspective,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      {children}
      {glare && (
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`,
            ),
          }}
          className="pointer-events-none absolute inset-0 z-10"
          aria-hidden
        />
      )}
    </motion.div>
  )
}
