"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface TechItem {
  name: string
  icon: React.ReactNode
  /** Optional category for grouping */
  category?: string
  /** Proficiency level 0-100 (shown as ring fill if provided) */
  level?: number
}

interface TechStackGridProps {
  items: TechItem[]
  /** Icon size in pixels */
  iconSize?: number
  /** Show proficiency ring */
  showLevel?: boolean
  /** Columns */
  columns?: 3 | 4 | 5 | 6
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Tech stack / skills icon grid with tooltip and optional proficiency ring.
 * Universal "what I use" section for portfolios, about pages, team pages.
 *
 * @example
 * <TechStackGrid
 *   items={[
 *     { name: "React", icon: <ReactIcon />, level: 95 },
 *     { name: "TypeScript", icon: <TSIcon />, level: 90 },
 *   ]}
 *   showLevel
 * />
 */
export function TechStackGrid({
  items,
  iconSize = 40,
  showLevel = false,
  columns = 5,
  className,
}: TechStackGridProps) {
  const colClass = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5",
    6: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6",
  }

  return (
    <div className={cn("grid gap-4", colClass[columns], className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent"
        >
          {/* Level ring */}
          {showLevel && item.level !== undefined && (
            <svg
              className="absolute -inset-px"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity={0.1}
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${item.level * 3.01} 301`}
                strokeLinecap="round"
                opacity={0.3}
                transform="rotate(-90 50 50)"
                className="transition-all duration-500"
              />
            </svg>
          )}
          {/* Icon */}
          <div
            className="flex items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground"
            style={{ width: iconSize, height: iconSize }}
          >
            {item.icon}
          </div>
          {/* Label */}
          <span className="text-center text-xs font-medium text-muted-foreground group-hover:text-foreground">
            {item.name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
