"use client"

import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface RetroGridProps {
  /** Grid line color */
  color?: string
  /** Perspective angle (higher = more dramatic vanishing) */
  angle?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Retro perspective vanishing-point grid background.
 * The synthwave / vaporwave / Tron-style grid from Magic UI.
 *
 * @example
 * <div className="relative h-96 overflow-hidden">
 *   <RetroGrid />
 *   <div className="relative z-10">Content above grid</div>
 * </div>
 */
export function RetroGrid({
  color = "oklch(from var(--foreground) l c h / 15%)",
  angle = 65,
  className,
}: RetroGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [perspective:300px]",
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        {/* Horizontal lines */}
        <div
          className="absolute inset-0 animate-retro-grid-scroll"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${color} 1px, transparent 0),
              linear-gradient(to bottom, ${color} 1px, transparent 0)
            `,
            backgroundSize: "60px 30px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
      {/* Gradient fade at edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
    </div>
  )
}

/* Required CSS (add to globals.css):
@keyframes retro-grid-scroll {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(30px);
  }
}
.animate-retro-grid-scroll {
  animation: retro-grid-scroll 1s linear infinite;
}
*/
