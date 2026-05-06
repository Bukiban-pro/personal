/**
 * AnimatedShinyText
 * Shimmer/shine effect that pans across text — a glaring light sweep.
 * Used for badge text, announcement banners, subtle hero taglines.
 *
 * Add @keyframes to globals.css:
 *   @keyframes shiny-text {
 *     0%, 90%, 100% { background-position: calc(-100% - var(--shiny-width)) 0; }
 *     30%, 60%      { background-position: calc(100% + var(--shiny-width)) 0; }
 *   }
 * And in tailwind.config.js extend.animation:
 *   "shiny-text": "shiny-text 8s infinite"
 *
 * Deps: none
 * Usage:
 *   <AnimatedShinyText className="text-sm font-medium">
 *     ✨ Introducing something new
 *   </AnimatedShinyText>
 *
 *   // Wider shimmer
 *   <AnimatedShinyText shimmerWidth={150} className="text-4xl font-bold">
 *     Premium quality
 *   </AnimatedShinyText>
 */
import { type ComponentPropsWithoutRef, type CSSProperties, type FC } from "react"
import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        "mx-auto max-w-md text-muted-foreground",
        // Shine effect
        "animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        // Shine gradient — dark mode safe
        "bg-linear-to-r from-transparent via-foreground/80 via-50% to-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
