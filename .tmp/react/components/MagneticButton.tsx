"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Magnetic pull strength (pixels of max displacement) */
  strength?: number
  /** Spring damping */
  damping?: number
  /** Spring stiffness */
  stiffness?: number
  /** Also magnetize children with a weaker pull */
  magnetizeChildren?: boolean
  children: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Button that's magnetically attracted to the cursor on hover.
 * Classic creative portfolio effect from Awwwards-style sites.
 *
 * @example
 * <MagneticButton strength={30}>
 *   <span>Hover me</span>
 * </MagneticButton>
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      strength = 25,
      damping = 15,
      stiffness = 150,
      magnetizeChildren = true,
      className,
      ...props
    },
    ref,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const combinedRef = useCombinedRef(ref, buttonRef)

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { damping, stiffness })
    const springY = useSpring(y, { damping, stiffness })

    // Inner content gets a weaker pull for depth
    const innerX = useMotionValue(0)
    const innerY = useMotionValue(0)
    const innerSpringX = useSpring(innerX, { damping, stiffness })
    const innerSpringY = useSpring(innerY, { damping, stiffness })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = buttonRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) / (rect.width / 2)
      const deltaY = (e.clientY - centerY) / (rect.height / 2)

      x.set(deltaX * strength)
      y.set(deltaY * strength)

      if (magnetizeChildren) {
        innerX.set(deltaX * strength * 0.4)
        innerY.set(deltaY * strength * 0.4)
      }
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
      innerX.set(0)
      innerY.set(0)
    }

    return (
      <motion.button
        ref={combinedRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className={cn("relative inline-flex items-center justify-center", className)}
        {...props}
      >
        {magnetizeChildren ? (
          <motion.span
            style={{ x: innerSpringX, y: innerSpringY }}
            className="inline-flex items-center justify-center"
          >
            {children}
          </motion.span>
        ) : (
          children
        )}
      </motion.button>
    )
  },
)
MagneticButton.displayName = "MagneticButton"

// ── Ref helper ─────────────────────────────────────────────────────────
function useCombinedRef<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return React.useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") ref(node)
        else if (ref && typeof ref === "object")
          (ref as React.MutableRefObject<T | null>).current = node
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  )
}
