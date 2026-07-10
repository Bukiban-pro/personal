"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface FeatureBlock {
  title: string
  description: string
  icon?: React.ReactNode
}

interface FeatureShowcaseProps {
  /** Visual element (image, video, illustration) — sticky on desktop */
  visual: React.ReactNode
  /** Feature blocks that scroll alongside the visual */
  features: FeatureBlock[]
  /** Visual side */
  visualSide?: "left" | "right"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Sticky visual + scrolling feature text blocks — the Stripe feature showcase.
 * On desktop: image stays pinned while text blocks scroll through.
 * On mobile: stacks vertically.
 *
 * @example
 * <FeatureShowcase
 *   visual={<img src="/dashboard.png" alt="Dashboard" className="rounded-xl shadow-2xl" />}
 *   features={[
 *     { title: "Real-time analytics", description: "Track every metric as it happens." },
 *     { title: "Team collaboration", description: "Work together seamlessly." },
 *     { title: "API access", description: "Build custom integrations." },
 *   ]}
 * />
 */
export function FeatureShowcase({
  visual,
  features,
  visualSide = "left",
  className,
}: FeatureShowcaseProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16",
        className,
      )}
    >
      {/* Visual — sticky */}
      <div
        className={cn(
          "flex items-start justify-center md:sticky md:top-24 md:h-fit",
          visualSide === "right" && "md:order-2",
        )}
      >
        {visual}
      </div>

      {/* Feature blocks */}
      <div
        className={cn(
          "space-y-24 py-12",
          visualSide === "right" && "md:order-1",
        )}
      >
        {features.map((feature, i) => (
          <FeatureBlockItem key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </div>
  )
}

// ── FeatureBlockItem ───────────────────────────────────────────────────
function FeatureBlockItem({
  feature,
  index,
}: {
  feature: FeatureBlock
  index: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.3"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1])
  const y = useTransform(scrollYProgress, [0, 1], [20, 0])

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="space-y-3">
      {feature.icon && (
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {feature.icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}
