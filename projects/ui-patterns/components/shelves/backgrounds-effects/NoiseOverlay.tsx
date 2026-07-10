import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface NoiseOverlayProps {
  /** Noise opacity (0-1) */
  opacity?: number
  /** Noise frequency (higher = finer grain) */
  frequency?: number
  /** Blend mode */
  blendMode?: React.CSSProperties["mixBlendMode"]
  /** Animate the noise (subtle flickering) */
  animated?: boolean
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * SVG noise/film-grain texture overlay.
 * Uses SVG feTurbulence for a true random noise pattern — no image assets.
 * Common on creative portfolios for that analog/cinematic feel.
 *
 * @example
 * <div className="relative">
 *   <NoiseOverlay opacity={0.05} />
 *   <div className="relative z-10">Content with grain</div>
 * </div>
 */
export function NoiseOverlay({
  opacity = 0.04,
  frequency = 0.65,
  blendMode = "overlay",
  animated = false,
  className,
}: NoiseOverlayProps) {
  const id = React.useId()

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-50", className)}
      style={{ opacity, mixBlendMode: blendMode }}
      aria-hidden
    >
      <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
        <filter id={`noise-${id}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={frequency}
            numOctaves={4}
            stitchTiles="stitch"
            seed={animated ? undefined : 0}
          >
            {animated && (
              <animate
                attributeName="seed"
                from="0"
                to="100"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noise-${id})`} />
      </svg>
    </div>
  )
}
