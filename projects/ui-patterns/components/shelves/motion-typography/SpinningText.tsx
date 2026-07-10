/**
 * SpinningText
 * Characters spread in a circle that continuously rotates.
 * Great for badges, decorative labels, "available for work" rings.
 *
 * Deps: motion/react
 * Usage:
 *   <SpinningText radius={5} duration={10}>available for work •</SpinningText>
 *   <SpinningText reverse duration={8} className="text-xs text-muted-foreground">
 *     scroll down • explore • discover •
 *   </SpinningText>
 */
"use client"

import React, { type ComponentPropsWithoutRef } from "react"
import { motion, type Transition, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

interface SpinningTextProps extends ComponentPropsWithoutRef<"div"> {
  children: string | string[]
  /** Rotation duration in seconds */
  duration?: number
  /** Reverse spin direction */
  reverse?: boolean
  /** Radius in ch units */
  radius?: number
  transition?: Transition
  variants?: {
    container?: Variants
    item?: Variants
  }
}

const BASE_TRANSITION: Transition = {
  repeat: Infinity,
  ease: "linear",
}

const BASE_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
}

export function SpinningText({
  children,
  duration = 10,
  reverse = false,
  radius = 5,
  transition,
  variants,
  className,
  style,
  ...props
}: SpinningTextProps) {
  if (typeof children !== "string" && !Array.isArray(children)) {
    throw new Error("SpinningText: children must be a string or array of strings")
  }

  const text = Array.isArray(children) ? children.join("") : children
  const letters = [...text.split(""), " "]

  const finalTransition: Transition = {
    ...BASE_TRANSITION,
    ...transition,
    duration: (transition as { duration?: number })?.duration ?? duration,
  }

  const containerVariants: Variants = {
    visible: { rotate: reverse ? -360 : 360 },
    ...variants?.container,
  }

  const itemVariants: Variants = {
    ...BASE_ITEM_VARIANTS,
    ...variants?.item,
  }

  return (
    <motion.div
      className={cn("relative", className)}
      style={style}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={finalTransition}
      {...props}
    >
      {letters.map((letter, index) => (
        <motion.span
          aria-hidden="true"
          key={`${index}-${letter}`}
          variants={itemVariants}
          className="absolute top-1/2 left-1/2 inline-block"
          style={
            {
              "--index": index,
              "--total": letters.length,
              "--radius": radius,
              transform: `
                translate(-50%, -50%)
                rotate(calc(360deg / var(--total) * var(--index)))
                translateY(calc(var(--radius, 5) * -1ch))
              `,
              transformOrigin: "center",
            } as React.CSSProperties
          }
        >
          {letter}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </motion.div>
  )
}
