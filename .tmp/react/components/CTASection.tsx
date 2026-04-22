"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface CTASectionProps {
  title: string
  description?: string
  primaryAction: { label: string; href?: string; onClick?: () => void }
  secondaryAction?: { label: string; href?: string; onClick?: () => void }
  variant?: "default" | "centered" | "split"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "centered",
  className,
}: CTASectionProps) {
  const ActionButton = ({
    action,
    isPrimary,
  }: {
    action: typeof primaryAction
    isPrimary: boolean
  }) => {
    const Comp = action.href ? "a" : "button"
    return (
      <Button
        asChild={!!action.href}
        variant={isPrimary ? "default" : "outline"}
        size="lg"
        onClick={action.onClick}
      >
        {action.href ? (
          <a href={action.href}>
            {action.label}
            {isPrimary && <ArrowRight className="ml-2 size-4" />}
          </a>
        ) : (
          <span>
            {action.label}
            {isPrimary && <ArrowRight className="ml-2 size-4" />}
          </span>
        )}
      </Button>
    )
  }

  if (variant === "split") {
    return (
      <section className={cn("py-16 md:py-24", className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-primary/5 p-8 md:flex-row md:p-12">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h2>
              {description && (
                <p className="mt-3 text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-3">
              <ActionButton action={primaryAction} isPrimary />
              {secondaryAction && (
                <ActionButton action={secondaryAction} isPrimary={false} />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "rounded-2xl bg-primary/5 p-8 md:p-16",
            variant === "centered" && "text-center",
          )}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ActionButton action={primaryAction} isPrimary />
            {secondaryAction && (
              <ActionButton action={secondaryAction} isPrimary={false} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
