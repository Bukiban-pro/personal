"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface Step {
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  /** 0-indexed current step */
  currentStep: number
  /** Orientation */
  variant?: "horizontal" | "vertical"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function StepIndicator({
  steps,
  currentStep,
  variant = "horizontal",
  className,
}: StepIndicatorProps) {
  if (variant === "vertical") {
    return (
      <div className={cn("space-y-0", className)}>
        {steps.map((step, i) => {
          const isComplete = i < currentStep
          const isCurrent = i === currentStep

          return (
            <div key={i} className="flex gap-4">
              {/* Line + circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isComplete &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isComplete && !isCurrent && "border-muted text-muted-foreground",
                  )}
                >
                  {isComplete ? <Check className="size-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-8 w-0.5",
                      i < currentStep ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <div className="pb-8">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    !isComplete && !isCurrent && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, i) => {
        const isComplete = i < currentStep
        const isCurrent = i === currentStep

        return (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  isComplete &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isComplete && !isCurrent && "border-muted text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent && "text-primary",
                  !isComplete && !isCurrent && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  i < currentStep ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
