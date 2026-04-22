"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, Home } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  /** Show home icon for first item */
  showHomeIcon?: boolean
  /** Separator between items */
  separator?: React.ReactNode
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function Breadcrumbs({
  items,
  showHomeIcon = true,
  separator,
  className,
}: BreadcrumbsProps) {
  const Sep = separator ?? <ChevronRight className="size-3.5 text-muted-foreground" />

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const isFirst = i === 0

          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">{Sep}</span>}

              {isLast ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {isFirst && showHomeIcon && <Home className="size-3.5" />}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span className="flex items-center gap-1 text-muted-foreground">
                  {isFirst && showHomeIcon && <Home className="size-3.5" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
