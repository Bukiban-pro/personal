"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface MeteorsProps {
  /** Number of meteors */
  count?: number
  /** Meteor color */
  color?: string
  /** Min/max speed in seconds */
  minDuration?: number
  maxDuration?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Shooting star / meteor shower animation.
 * Pure CSS — adds cinematic flair to hero sections and dark backgrounds.
 * Inspired by Aceternity UI / Magic UI's Meteors component.
 *
 * @example
 * <div className="relative h-96 overflow-hidden bg-background">
 *   <Meteors count={15} />
 *   <div className="relative z-10">Content</div>
 * </div>
 */
export function Meteors({
  count = 12,
  color = "oklch(from var(--foreground) l c h)",
  minDuration = 2,
  maxDuration = 8,
  className,
}: MeteorsProps) {
  const meteors = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: minDuration + Math.random() * (maxDuration - minDuration),
        size: 1 + Math.random() * 2,
        tailLength: 40 + Math.random() * 80,
      })),
    [count, minDuration, maxDuration],
  )

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute animate-meteor rounded-full"
          style={{
            left: m.left,
            top: "-5%",
            width: m.size,
            height: m.size,
            backgroundColor: color,
            boxShadow: `0 0 0 1px ${color}`,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            ["--tail-length" as string]: `${m.tailLength}px`,
          }}
        >
          {/* Tail */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2"
            style={{
              width: 1,
              height: m.tailLength,
              background: `linear-gradient(to top, ${color}, transparent)`,
              opacity: 0.6,
            }}
          />
        </span>
      ))}
    </div>
  )
}

/* Required CSS (add to globals.css):
@keyframes meteor {
  0% {
    transform: translateY(0) translateX(0) rotate(215deg);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translateY(150vh) translateX(-50vw) rotate(215deg);
    opacity: 0;
  }
}
.animate-meteor {
  animation: meteor linear infinite;
}
*/
