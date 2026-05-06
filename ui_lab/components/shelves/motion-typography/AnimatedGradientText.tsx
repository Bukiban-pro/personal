import * as React from "react"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Gradient colors (OKLCH or any CSS color) */
  colors?: string[]
  /** Animation duration in seconds */
  duration?: number
  children: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Text with animated gradient fill that sweeps across.
 * The premium heading effect seen in Vercel, Linear, Stripe landing pages.
 *
 * @example
 * <AnimatedGradientText className="text-4xl font-bold">
 *   Build something amazing
 * </AnimatedGradientText>
 *
 * <AnimatedGradientText
 *   colors={["oklch(0.7 0.25 270)", "oklch(0.65 0.3 330)", "oklch(0.7 0.2 200)"]}
 *   duration={4}
 * >
 *   Custom gradient
 * </AnimatedGradientText>
 */
export function AnimatedGradientText({
  colors = [
    "oklch(0.7 0.25 270)",
    "oklch(0.65 0.3 330)",
    "oklch(0.7 0.2 200)",
    "oklch(0.7 0.25 270)",
  ],
  duration = 6,
  className,
  children,
  ...props
}: AnimatedGradientTextProps) {
  const gradient = colors.join(", ")

  return (
    <span
      className={cn("animate-gradient-text bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: "300% 100%",
        animationDuration: `${duration}s`,
      }}
      {...props}
    >
      {children}
    </span>
  )
}

/* Required CSS (add to globals.css):
@keyframes gradient-text {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-text {
  animation: gradient-text var(--duration, 6s) ease infinite;
}
*/
