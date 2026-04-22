"use client"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface KPICardProps {
  title: string
  value: string | number
  /** Previous period comparison, e.g. "+12.5%" or "-3.2%" */
  change?: string
  /** Trend direction — auto-detected from `change` if omitted */
  trend?: "up" | "down" | "neutral"
  /** Description, e.g. "vs last month" */
  changeLabel?: string
  /** Icon for the card */
  icon?: LucideIcon
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function KPICard({
  title,
  value,
  change,
  trend: explicitTrend,
  changeLabel,
  icon: Icon,
  className,
}: KPICardProps) {
  const trend =
    explicitTrend ??
    (change?.startsWith("+")
      ? "up"
      : change?.startsWith("-")
        ? "down"
        : "neutral")

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <TrendIcon
              className={cn(
                "size-3.5",
                trend === "up" && "text-green-600 dark:text-green-400",
                trend === "down" && "text-red-600 dark:text-red-400",
                trend === "neutral" && "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "font-medium",
                trend === "up" && "text-green-600 dark:text-green-400",
                trend === "down" && "text-red-600 dark:text-red-400",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {change}
            </span>
            {changeLabel && (
              <span className="text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
