"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface StackedCardsProps {
  children: React.ReactNode
  /** Vertical offset between stacked cards (px) */
  stackOffset?: number
  /** Scale reduction per card depth */
  scaleStep?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Cards that stack on top of each other as the user scrolls,
 * like Apple's feature cards or Stripe's pricing comparison.
 * Each card pins, then gets pushed up and slightly scaled down
 * when the next card scrolls in.
 *
 * @example
 * <StackedCards>
 *   <div className="h-[80vh] bg-blue-500 rounded-3xl p-12">Card 1</div>
 *   <div className="h-[80vh] bg-green-500 rounded-3xl p-12">Card 2</div>
 *   <div className="h-[80vh] bg-purple-500 rounded-3xl p-12">Card 3</div>
 * </StackedCards>
 */
export function StackedCards({
  children,
  stackOffset = 20,
  scaleStep = 0.03,
  className,
}: StackedCardsProps) {
  const items = React.Children.toArray(children)
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ height: `${items.length * 100}vh` }}
    >
      {items.map((child, i) => (
        <StackCard
          key={i}
          index={i}
          total={items.length}
          containerRef={containerRef}
          stackOffset={stackOffset}
          scaleStep={scaleStep}
        >
          {child}
        </StackCard>
      ))}
    </div>
  )
}

// ── StackCard ──────────────────────────────────────────────────────────
function StackCard({
  children,
  index,
  total,
  containerRef,
  stackOffset,
  scaleStep,
}: {
  children: React.ReactNode
  index: number
  total: number
  containerRef: React.RefObject<HTMLDivElement | null>
  stackOffset: number
  scaleStep: number
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Each card occupies 1/total of the scroll range
  const cardStart = index / total
  const cardEnd = (index + 1) / total

  // Scale down as next cards come in
  const targetScale = 1 - (total - 1 - index) * scaleStep
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [1, targetScale],
  )

  // Push up slightly as next card comes in
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [0, -stackOffset * (total - 1 - index)],
  )

  return (
    <motion.div
      style={{
        scale,
        y,
        top: `${index * stackOffset}px`,
      }}
      className="sticky top-0 origin-top px-4"
    >
      {children}
    </motion.div>
  )
}
