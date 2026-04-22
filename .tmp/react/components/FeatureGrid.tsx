"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureGridProps {
  features: Feature[]
  title?: string
  subtitle?: string
  columns?: 2 | 3 | 4
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function FeatureGrid({
  features,
  title,
  subtitle,
  columns = 3,
  className,
}: FeatureGridProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mx-auto max-w-2xl text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        {/* Grid */}
        <div
          className={cn(
            "mt-12 grid gap-8",
            columns === 2 && "sm:grid-cols-2",
            columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
          )}
        >
          {features.map((feature) => (
            <div key={feature.title} className="relative">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
