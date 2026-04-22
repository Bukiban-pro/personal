"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  type PanInfo,
} from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface DraggableCardsProps {
  /** Card items — rendered via renderCard */
  items: { id: string | number; [key: string]: unknown }[]
  /** Render function for each card */
  renderCard: (item: DraggableCardsProps["items"][number]) => React.ReactNode
  /** Called when a card is swiped off */
  onSwipe?: (item: DraggableCardsProps["items"][number], direction: "left" | "right") => void
  /** Swipe threshold in px */
  threshold?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Swipeable card stack (Tinder pattern).
 * Drag cards left/right to dismiss. Bottom cards scale up as top leaves.
 * Rotation follows drag direction for natural feel.
 *
 * @example
 * <DraggableCards
 *   items={profiles}
 *   renderCard={(item) => (
 *     <div className="h-96 w-72 rounded-2xl bg-card p-6">
 *       <h3>{item.name}</h3>
 *     </div>
 *   )}
 *   onSwipe={(item, dir) => console.log(item.id, dir)}
 * />
 */
export function DraggableCards({
  items,
  renderCard,
  onSwipe,
  threshold = 120,
  className,
}: DraggableCardsProps) {
  const [stack, setStack] = React.useState(items)

  React.useEffect(() => {
    setStack(items)
  }, [items])

  const handleSwipe = (direction: "left" | "right") => {
    const [top, ...rest] = stack
    if (!top) return
    onSwipe?.(top, direction)
    setStack(rest)
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {stack
        .slice(0, 3)
        .reverse()
        .map((item, reverseIndex) => {
          const index = Math.min(stack.length, 3) - 1 - reverseIndex
          const isTop = index === 0

          return (
            <SwipeCard
              key={item.id}
              isTop={isTop}
              stackIndex={index}
              threshold={threshold}
              onSwipe={handleSwipe}
            >
              {renderCard(item)}
            </SwipeCard>
          )
        })}
    </div>
  )
}

// ── SwipeCard ──────────────────────────────────────────────────────────
function SwipeCard({
  children,
  isTop,
  stackIndex,
  threshold,
  onSwipe,
}: {
  children: React.ReactNode
  isTop: boolean
  stackIndex: number
  threshold: number
  onSwipe: (direction: "left" | "right") => void
}) {
  const x = useMotionValue(0)
  const controls = useAnimation()

  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.5, 1, 1, 1, 0.5],
  )

  const scale = 1 - stackIndex * 0.05
  const yOffset = stackIndex * 10

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? "right" : "left"
      controls
        .start({
          x: info.offset.x > 0 ? 500 : -500,
          opacity: 0,
          transition: { duration: 0.3 },
        })
        .then(() => onSwipe(direction))
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500 } })
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity, scale, y: yOffset, zIndex: 10 - stackIndex }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}
