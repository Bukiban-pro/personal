"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface MarqueeProps {
  children: React.ReactNode
  /** Pixels per second */
  speed?: number
  /** Scroll direction */
  direction?: "left" | "right"
  /** Pause on hover */
  pauseOnHover?: boolean
  /** Disable reduced-motion users */
  respectMotionPreference?: boolean
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function Marquee({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  respectMotionPreference = true,
  className,
}: MarqueeProps) {
  const duration = `${100 / (speed / 40)}s`

  return (
    <div
      className={cn(
        "group flex gap-4 overflow-hidden [--gap:1rem]",
        respectMotionPreference && "motion-reduce:overflow-auto",
        className,
      )}
      style={
        {
          "--duration": duration,
          "--direction": direction === "left" ? "normal" : "reverse",
        } as React.CSSProperties
      }
    >
      {/* Original + clone for seamless loop */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 items-center gap-4",
            "animate-[marquee_var(--duration)_linear_var(--direction)_infinite]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            respectMotionPreference && "motion-reduce:animate-none",
          )}
          aria-hidden={i === 1}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

// ── Required keyframes (add to globals.css or tailwind config) ─────────
// @keyframes marquee {
//   from { transform: translateX(0); }
//   to { transform: translateX(calc(-100% - var(--gap))); }
// }
