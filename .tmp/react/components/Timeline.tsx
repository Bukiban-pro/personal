"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface TimelineItem {
  title: string
  description?: string
  date?: string
  icon?: LucideIcon
  /** Color accent for the dot/icon */
  variant?: "default" | "success" | "warning" | "destructive" | "info"
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function Timeline({ items, className }: TimelineProps) {
  const dotColor = (variant: TimelineItem["variant"] = "default") => {
    switch (variant) {
      case "success":
        return "bg-[var(--color-success,#22c55e)]"
      case "warning":
        return "bg-[var(--color-warning,#eab308)]"
      case "destructive":
        return "bg-destructive"
      case "info":
        return "bg-[var(--color-info,#3b82f6)]"
      default:
        return "bg-primary"
    }
  }

  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline rail */}
          <div className="flex flex-col items-center">
            {/* Dot or icon */}
            {item.icon ? (
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  dotColor(item.variant),
                )}
              >
                <item.icon className="size-4 text-white" />
              </div>
            ) : (
              <div
                className={cn(
                  "mt-1.5 size-3 shrink-0 rounded-full",
                  dotColor(item.variant),
                )}
              />
            )}

            {/* Connector line */}
            {i < items.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>

          {/* Content */}
          <div className="pb-8">
            <div className="flex items-baseline gap-2">
              <h4 className="text-sm font-semibold">{item.title}</h4>
              {item.date && (
                <time className="text-xs text-muted-foreground">
                  {item.date}
                </time>
              )}
            </div>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
