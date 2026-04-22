"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface DockItem {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
}

interface DockProps {
  items: DockItem[]
  /** Base icon size in pixels */
  baseSize?: number
  /** Max magnified size in pixels */
  maxSize?: number
  /** Magnification range (how far the effect spreads) */
  magnificationRange?: number
  /** Position */
  position?: "bottom" | "left" | "right"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * macOS-style dock with magnification on hover.
 * Uses Framer Motion springs for fluid icon scaling.
 *
 * @example
 * <Dock
 *   items={[
 *     { icon: <Home />, label: "Home", href: "/" },
 *     { icon: <Mail />, label: "Mail", onClick: () => {} },
 *   ]}
 * />
 */
export function Dock({
  items,
  baseSize = 48,
  maxSize = 72,
  magnificationRange = 140,
  position = "bottom",
  className,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  const isVertical = position === "left" || position === "right"

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        mouseX.set(isVertical ? e.clientY - rect.top : e.clientX - rect.left)
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex items-end gap-2 rounded-2xl border border-border bg-background/80 p-2 shadow-xl backdrop-blur-md",
        isVertical ? "flex-col items-center" : "flex-row",
        className,
      )}
    >
      {items.map((item, i) => (
        <DockIcon
          key={i}
          item={item}
          mouseX={mouseX}
          index={i}
          baseSize={baseSize}
          maxSize={maxSize}
          magnificationRange={magnificationRange}
          isVertical={isVertical}
        />
      ))}
    </motion.div>
  )
}

// ── Dock Icon ──────────────────────────────────────────────────────────
interface DockIconProps {
  item: DockItem
  mouseX: ReturnType<typeof useMotionValue<number>>
  index: number
  baseSize: number
  maxSize: number
  magnificationRange: number
  isVertical: boolean
}

function DockIcon({
  item,
  mouseX,
  index,
  baseSize,
  maxSize,
  magnificationRange,
  isVertical,
}: DockIconProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const el = ref.current
    if (!el) return magnificationRange
    const rect = el.getBoundingClientRect()
    const center = isVertical
      ? rect.top + rect.height / 2 - (el.parentElement?.getBoundingClientRect().top ?? 0)
      : rect.left + rect.width / 2 - (el.parentElement?.getBoundingClientRect().left ?? 0)
    return Math.abs(val - center)
  })

  const size = useSpring(
    useTransform(
      distance,
      [0, magnificationRange],
      [maxSize, baseSize],
    ),
    { damping: 20, stiffness: 200 },
  )

  const Wrapper = item.href ? "a" : "button"
  const wrapperProps = item.href
    ? { href: item.href }
    : { onClick: item.onClick }

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="group relative"
    >
      <Wrapper
        {...wrapperProps}
        className="flex size-full items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent"
        aria-label={item.label}
      >
        {item.icon}
      </Wrapper>
      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
        {item.label}
      </span>
    </motion.div>
  )
}
