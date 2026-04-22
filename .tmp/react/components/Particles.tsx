"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface ParticlesProps {
  /** Number of particles */
  count?: number
  /** Min/max particle size in pixels */
  minSize?: number
  maxSize?: number
  /** Particle color */
  color?: string
  /** Min/max animation duration in seconds */
  minDuration?: number
  maxDuration?: number
  /** Overall opacity */
  opacity?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Floating particles background — CSS-only, zero JS animation overhead.
 * Inspired by creative portfolio particle effects (simplified from Three.js).
 *
 * @example
 * <div className="relative h-screen bg-background">
 *   <Particles count={40} />
 *   <div className="relative z-10">Content</div>
 * </div>
 */
export function Particles({
  count = 30,
  minSize = 1,
  maxSize = 3,
  color = "currentColor",
  minDuration = 15,
  maxDuration = 45,
  opacity = 0.3,
  className,
}: ParticlesProps) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = minSize + Math.random() * (maxSize - minSize)
      const duration = minDuration + Math.random() * (maxDuration - minDuration)
      return {
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration,
        delay: Math.random() * duration,
        drift: (Math.random() - 0.5) * 100,
      }
    })
  }, [count, minSize, maxSize, minDuration, maxDuration])

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity }}
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-particle rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            backgroundColor: color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

/* Required CSS (add to globals.css):
@keyframes particle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(var(--drift, 0px));
    opacity: 0;
  }
}
.animate-particle {
  animation: particle linear infinite;
}
*/
