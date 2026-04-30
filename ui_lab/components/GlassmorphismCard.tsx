import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Blur intensity in pixels */
  blur?: number
  /** Background opacity (0-1) */
  bgOpacity?: number
  /** Show frosted border */
  border?: boolean
  /** Border opacity */
  borderOpacity?: number
  children: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Glassmorphism / frosted glass card.
 * The translucent, blurred card from Apple-style UI and creative portfolios.
 *
 * @example
 * <GlassmorphismCard className="p-8">
 *   <h3>Glass effect</h3>
 *   <p>Content behind is blurred</p>
 * </GlassmorphismCard>
 *
 * <GlassmorphismCard blur={20} bgOpacity={0.1}>
 *   <p>Heavy blur variant</p>
 * </GlassmorphismCard>
 */
export const GlassmorphismCard = React.forwardRef<HTMLDivElement, GlassmorphismCardProps>(
  ({ blur = 12, bgOpacity = 0.15, border = true, borderOpacity = 0.2, className, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-xl", className)}
        style={{
          background: `oklch(from var(--background) l c h / ${bgOpacity})`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          ...(border && {
            border: `1px solid oklch(from var(--foreground) l c h / ${borderOpacity})`,
          }),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
GlassmorphismCard.displayName = "GlassmorphismCard"
