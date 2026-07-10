/**
 * LineShadowText
 * Text with a continuously moving diagonal line shadow effect.
 * Uses CSS `after:` pseudo-element with a striped conic-ish gradient
 * clipped to text shape, scrolling at 45° via `@keyframes line-shadow`.
 *
 * CSS needed in globals.css:
 *   @keyframes line-shadow {
 *     0%   { background-position: 0 0; }
 *     100% { background-position: 100% -100%; }
 *   }
 * And in tailwind.config.ts:
 *   "line-shadow": "line-shadow 15s linear infinite"
 *
 * Deps: motion/react
 * Usage:
 *   <h1 className="text-6xl font-bold">
 *     <LineShadowText shadowColor="oklch(0.7 0.2 270)">Hello World</LineShadowText>
 *   </h1>
 *
 *   // Dark mode
 *   <LineShadowText shadowColor="white">Hello World</LineShadowText>
 *
 *   // As h2
 *   <LineShadowText as="h2" shadowColor="#ff6600">Fire Text</LineShadowText>
 */
"use client"

import { type CSSProperties, type HTMLAttributes } from "react"
import { motion, type DOMMotionComponents, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = Extract<keyof DOMMotionComponents, keyof typeof motionElements>

interface LineShadowTextProps
  extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: string
  /** Color of the moving line shadow @default "black" */
  shadowColor?: string
  /** HTML element to render as @default "span" */
  as?: MotionElementType
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motionElements[Component]

  return (
    <MotionComponent
      style={{ "--shadow-color": shadowColor } as CSSProperties}
      className={cn(
        "relative z-0 inline-flex",
        "after:absolute after:top-[0.04em] after:left-[0.04em] after:content-[attr(data-text)]",
        "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]",
        "after:-z-10 after:bg-size-[0.06em_0.06em] after:bg-clip-text after:text-transparent",
        "after:animate-line-shadow",
        className
      )}
      data-text={children}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}
