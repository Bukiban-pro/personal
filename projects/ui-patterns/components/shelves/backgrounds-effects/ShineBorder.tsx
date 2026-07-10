/**
 * ShineBorder
 * Animated sweeping radial-gradient border effect via mask compositing.
 * Wraps a container and animates a shine across the border.
 * Add @keyframes shine to globals.css:
 *   @keyframes shine {
 *     0%  { background-position: 0% 0%; }
 *     50% { background-position: 100% 100%; }
 *     to  { background-position: 0% 0%; }
 *   }
 * And in tailwind.config.js extend.animation:
 *   "shine": "shine var(--duration) infinite linear"
 *
 * Deps: none
 * Usage:
 *   <div className="relative rounded-xl p-4 bg-background">
 *     <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
 *     <p>Card content</p>
 *   </div>
 */
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Border width in px */
  borderWidth?: number
  /** Animation duration in seconds */
  duration?: number
  /** Color(s) of the shine — single hex or array for gradient */
  shineColor?: string | string[]
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#ffffff",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
          backgroundSize: "300% 300%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  )
}
