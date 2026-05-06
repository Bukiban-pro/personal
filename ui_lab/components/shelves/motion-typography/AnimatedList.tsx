"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface AnimatedListProps {
  children: React.ReactNode
  /** Stagger delay between items (seconds) */
  stagger?: number
  /** Animation per item */
  duration?: number
  /** Direction items enter from */
  direction?: "up" | "down" | "left" | "right"
  /** Re-animate when items change */
  animateOnChange?: boolean
  className?: string
}

// ── Offset map ─────────────────────────────────────────────────────────
const offsets = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * List items that stagger-animate in one by one.
 * Works for notification feeds, activity logs, team lists, feature lists.
 *
 * @example
 * <AnimatedList stagger={0.1}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </AnimatedList>
 *
 * // With direction
 * <AnimatedList direction="left" stagger={0.08}>
 *   {notifications.map(n => <NotificationCard key={n.id} {...n} />)}
 * </AnimatedList>
 */
export function AnimatedList({
  children,
  stagger = 0.1,
  duration = 0.4,
  direction = "up",
  animateOnChange = false,
  className,
}: AnimatedListProps) {
  const items = React.Children.toArray(children)
  const offset = offsets[direction]

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode={animateOnChange ? "popLayout" : "sync"}>
        {items.map((child, i) => (
          <motion.div
            key={animateOnChange ? `${i}-${items.length}` : i}
            initial={{ opacity: 0, filter: "blur(4px)", ...offset }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0 }}
            exit={{ opacity: 0, filter: "blur(4px)", ...offset }}
            transition={{
              duration,
              delay: i * stagger,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
