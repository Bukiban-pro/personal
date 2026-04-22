"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface CursorFollowerProps {
  /** Cursor size in pixels */
  size?: number
  /** Outer ring size (0 to disable) */
  ringSize?: number
  /** Cursor color */
  color?: string
  /** Spring damping (higher = slower follow) */
  damping?: number
  /** Spring stiffness */
  stiffness?: number
  /** Scale multiplier when hovering interactive elements */
  hoverScale?: number
  /** CSS selector for elements that trigger hover state */
  hoverSelector?: string
  /** Hide the default system cursor */
  hideDefault?: boolean
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Custom cursor follower — the signature creative portfolio effect.
 * Place once in your layout; it renders a fixed-position dot + optional ring.
 *
 * @example
 * // In layout.tsx — cursor follows mouse everywhere
 * <CursorFollower hideDefault />
 *
 * // With larger hover effect on links/buttons
 * <CursorFollower hoverSelector="a, button" hoverScale={2.5} />
 */
export function CursorFollower({
  size = 10,
  ringSize = 36,
  color = "oklch(from var(--foreground) l c h)",
  damping = 20,
  stiffness = 300,
  hoverScale = 2,
  hoverSelector = "a, button, [data-cursor-hover]",
  hideDefault = false,
  className,
}: CursorFollowerProps) {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { damping, stiffness })
  const springY = useSpring(cursorY, { damping, stiffness })

  const [isHovering, setIsHovering] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Hover detection on interactive elements
    const handleElementEnter = () => setIsHovering(true)
    const handleElementLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Attach hover listeners to matching elements
    const elements = document.querySelectorAll(hoverSelector)
    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementEnter)
      el.addEventListener("mouseleave", handleElementLeave)
    })

    // Hide default cursor
    if (hideDefault) {
      document.body.style.cursor = "none"
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementEnter)
        el.removeEventListener("mouseleave", handleElementLeave)
      })
      if (hideDefault) {
        document.body.style.cursor = ""
      }
    }
  }, [cursorX, cursorY, hoverSelector, hideDefault, isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          backgroundColor: color,
        }}
        animate={{ scale: isHovering ? hoverScale : 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference",
          className,
        )}
        aria-hidden
      />
      {/* Ring */}
      {ringSize > 0 && (
        <motion.div
          style={{
            x: springX,
            y: springY,
            width: ringSize,
            height: ringSize,
            borderColor: color,
          }}
          animate={{
            scale: isHovering ? hoverScale * 0.6 : 1,
            opacity: isHovering ? 0 : 0.4,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border mix-blend-difference"
          aria-hidden
        />
      )}
    </>
  )
}
