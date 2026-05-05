/**
 * GlareHover
 * CSS-only diagonal glare sweep on hover using ::before pseudo-element gradient.
 * Zero deps — fully CSS variable driven.
 *
 * Usage:
 *   <GlareHover background="#0a0a0a" color="#ffffff" opacity={0.4}>
 *     <img src="..." />
 *   </GlareHover>
 *
 *   // Custom angle, purple glare
 *   <GlareHover angle={-30} color="#a78bfa" size={280} duration={800}>
 *     <div>Card content</div>
 *   </GlareHover>
 */
import type { ComponentProps, CSSProperties } from "react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

type Color = `#${string}`
type RGBA = `rgba(${number},${number},${number},${number})`

function parseHEX(color: Color, opacity: number): RGBA | Color {
  const hex = color.replace("#", "")
  const parse = (h: string) => Number.parseInt(h, 16)
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return `rgba(${parse(hex.slice(0, 2))},${parse(hex.slice(2, 4))},${parse(hex.slice(4, 6))},${opacity})`
  }
  if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    return `rgba(${parse(hex[0] + hex[0])},${parse(hex[1] + hex[1])},${parse(hex[2] + hex[2])},${opacity})`
  }
  return color
}

export interface GlareHoverProps extends ComponentProps<"div"> {
  /** CSS width (e.g. "100%", "320px") */
  width?: string
  /** CSS height (e.g. "auto", "200px") */
  height?: string
  /** Background color of the wrapper */
  background?: string
  /** Glare highlight color as hex */
  color?: Color
  /** Opacity of the glare (0–1) */
  opacity?: number
  /** Gradient angle in degrees */
  angle?: number
  /** Glare tile size as % of element */
  size?: number
  /** Transition duration in ms */
  duration?: number
  /** When true, glare only runs on first hover (no pre-animation) */
  playOnce?: boolean
}

export function GlareHover({
  background = "#000",
  children,
  color = "#ffffff",
  opacity = 0.5,
  angle = -45,
  size = 250,
  duration = 650,
  playOnce = false,
  className,
  style,
  width,
  height,
  ...props
}: GlareHoverProps) {
  const rgba = useMemo(() => parseHEX(color, opacity), [color, opacity])

  const cssVars = {
    "--gh-angle": `${angle}deg`,
    "--gh-duration": `${duration}ms`,
    "--gh-size": `${size}%`,
    "--gh-rgba": rgba,
    background,
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  } as CSSProperties

  return (
    <div
      {...props}
      className={cn(
        "relative grid size-fit cursor-pointer place-items-center overflow-hidden bg-transparent",
        // before element
        "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-no-repeat before:content-['']",
        // gradient
        "before:[background-image:linear-gradient(var(--gh-angle),transparent_60%,var(--gh-rgba)_70%,transparent,transparent_100%)]",
        // size + position
        "before:[background-size:var(--gh-size)_var(--gh-size),100%_100%]",
        "before:[background-position:-100%_-100%,0_0]",
        // transition
        !playOnce && "before:transition-[background-position] before:duration-[var(--gh-duration)] before:ease-in-out",
        playOnce && "before:transition-none hover:before:transition-[background-position] hover:before:duration-[var(--gh-duration)]",
        // hover
        "hover:before:[background-position:100%_100%,0_0]",
        className
      )}
      style={cssVars}
    >
      {children}
    </div>
  )
}
