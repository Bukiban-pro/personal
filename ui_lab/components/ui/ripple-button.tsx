"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ripple color (defaults to currentColor with opacity) */
  rippleColor?: string
  /** Ripple duration in ms */
  duration?: number
  children: React.ReactNode
}

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Material Design–style ripple effect button.
 * Zero dependencies — pure CSS animation with React state.
 *
 * @example
 * <RippleButton className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
 *   Click me
 * </RippleButton>
 */
export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ children, rippleColor, duration = 600, className, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([])
    let counter = React.useRef(0)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const id = ++counter.current
      setRipples((prev) => [...prev, { id, x, y, size }])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, duration)

      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute animate-ripple rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor ?? "currentColor",
              opacity: 0.2,
              animationDuration: `${duration}ms`,
            }}
            aria-hidden
          />
        ))}
      </button>
    )
  },
)
RippleButton.displayName = "RippleButton"

/* Required CSS keyframe (add to globals.css):
@keyframes ripple {
  to {
    transform: scale(1);
    opacity: 0;
  }
}
.animate-ripple {
  transform: scale(0);
  animation: ripple var(--duration, 600ms) ease-out forwards;
}
*/
