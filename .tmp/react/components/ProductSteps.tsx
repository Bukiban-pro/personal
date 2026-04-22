"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface Step {
  step: number | string
  title: string
  description: string
  icon?: LucideIcon
}

interface ProductStepsProps {
  steps: Step[]
  title?: string
  subtitle?: string
  variant?: "horizontal" | "vertical"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function ProductSteps({
  steps,
  title = "How it works",
  subtitle,
  variant = "horizontal",
  className,
}: ProductStepsProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Steps */}
        {variant === "horizontal" ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {/* Connector line (except last) */}
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border lg:block" />
                )}

                {/* Step number / icon */}
                <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                  {step.icon ? (
                    <step.icon className="size-7 text-primary" />
                  ) : (
                    <span className="text-xl font-bold text-primary">
                      {step.step}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                {/* Left: number + connector */}
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.icon ? (
                      <step.icon className="size-5" />
                    ) : (
                      step.step
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-border" />
                  )}
                </div>

                {/* Right: content */}
                <div className="pb-8">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
