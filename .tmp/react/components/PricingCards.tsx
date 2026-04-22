"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ── Types ──────────────────────────────────────────────────────────────
interface PricingFeature {
  text: string
  included: boolean
  highlight?: boolean
}

interface PricingPlan {
  name: string
  description: string
  price: string | number
  interval?: string // "month" | "year" | "one-time"
  badge?: string // "Popular", "Best Value", etc.
  features: PricingFeature[]
  cta: string
  highlighted?: boolean
  onSelect?: () => void
}

interface PricingCardsProps {
  plans: PricingPlan[]
  title?: string
  subtitle?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function PricingCards({
  plans,
  title = "Simple, transparent pricing",
  subtitle = "Choose the plan that's right for you",
  className,
}: PricingCardsProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {/* Cards */}
        <div
          className={cn(
            "mx-auto mt-12 grid max-w-md gap-8 lg:max-w-none",
            plans.length === 2 && "lg:grid-cols-2",
            plans.length >= 3 && "lg:grid-cols-3",
          )}
        >
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.highlighted &&
                  "border-primary shadow-lg ring-1 ring-primary",
              )}
            >
              {plan.badge && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  variant="default"
                >
                  {plan.badge}
                </Badge>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold tracking-tight">
                    {typeof plan.price === "number"
                      ? `$${plan.price}`
                      : plan.price}
                  </span>
                  {plan.interval && (
                    <span className="ml-1 text-sm text-muted-foreground">
                      /{plan.interval}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          feature.included
                            ? "text-primary"
                            : "text-muted-foreground/40",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          !feature.included &&
                            "text-muted-foreground line-through",
                          feature.highlight && "font-medium",
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={plan.onSelect}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
