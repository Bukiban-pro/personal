"use client"

import * as React from "react"
import { motion, useInView, useSpring, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface Stat {
  value: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
}

interface CountUpStatsProps {
  stats: Stat[]
  /** Grid columns */
  columns?: 2 | 3 | 4
  /** Count-up duration in seconds */
  duration?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Statistics section with count-up numbers on scroll.
 * Numbers animate from 0 to target when the section enters the viewport.
 * The "impressive numbers" section from every SaaS landing page.
 *
 * @example
 * <CountUpStats
 *   stats={[
 *     { value: 50000, label: "Active Users", suffix: "+" },
 *     { value: 99.9, label: "Uptime", suffix: "%", decimals: 1 },
 *     { value: 150, label: "Countries" },
 *     { value: 4.9, label: "Rating", prefix: "★ ", decimals: 1 },
 *   ]}
 * />
 */
export function CountUpStats({
  stats,
  columns = 4,
  duration = 2,
  className,
}: CountUpStatsProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div
      ref={ref}
      className={cn("grid gap-8 text-center", colClass[columns], className)}
    >
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} isInView={isInView} duration={duration} />
      ))}
    </div>
  )
}

// ── StatItem ───────────────────────────────────────────────────────────
function StatItem({
  stat,
  isInView,
  duration,
}: {
  stat: Stat
  isInView: boolean
  duration: number
}) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  const [display, setDisplay] = React.useState("0")

  React.useEffect(() => {
    if (isInView) {
      motionValue.set(stat.value)
    }
  }, [isInView, motionValue, stat.value])

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      const formatted =
        stat.decimals != null
          ? latest.toFixed(stat.decimals)
          : Math.round(latest).toLocaleString()
      setDisplay(formatted)
    })
    return unsubscribe
  }, [spring, stat.decimals])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="space-y-1"
    >
      <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {stat.prefix}
        {display}
        {stat.suffix}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  )
}
