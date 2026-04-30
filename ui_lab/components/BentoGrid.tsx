"use client"

import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

interface BentoCardProps {
  children: React.ReactNode
  /** Span columns: 1 (default), 2, or 3 */
  colSpan?: 1 | 2 | 3
  /** Span rows: 1 (default), 2, or 3 */
  rowSpan?: 1 | 2 | 3
  className?: string
}

// ── Components ─────────────────────────────────────────────────────────
export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(180px,_1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function BentoCard({
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg",
        colSpan === 2 && "sm:col-span-2",
        colSpan === 3 && "sm:col-span-2 lg:col-span-3",
        rowSpan === 2 && "row-span-2",
        rowSpan === 3 && "row-span-3",
        className,
      )}
    >
      {children}
    </div>
  )
}
