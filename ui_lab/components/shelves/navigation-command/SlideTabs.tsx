"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface SlideTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  /** Visual style */
  variant?: "pill" | "underline"
  /** Size */
  size?: "sm" | "md" | "lg"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Tabs with animated sliding background indicator.
 * The "magic underline" or "pill slide" that follows the active tab.
 * Uses Framer Motion layoutId for buttery smooth transitions.
 *
 * @example
 * const [tab, setTab] = useState("overview")
 * <SlideTabs
 *   tabs={[
 *     { id: "overview", label: "Overview" },
 *     { id: "analytics", label: "Analytics" },
 *     { id: "settings", label: "Settings" },
 *   ]}
 *   activeTab={tab}
 *   onTabChange={setTab}
 * />
 */
export function SlideTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "pill",
  size = "md",
  className,
}: SlideTabsProps) {
  const sizeClass = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3.5 py-1.5",
    lg: "text-base px-5 py-2",
  }

  return (
    <div
      className={cn(
        "relative inline-flex rounded-lg",
        variant === "pill" && "bg-secondary p-1",
        variant === "underline" && "border-b border-border",
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            type="button"
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-md font-medium transition-colors",
              sizeClass[size],
              isActive
                ? variant === "pill"
                  ? "text-foreground"
                  : "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.icon}
            {tab.label}

            {/* Sliding indicator */}
            {isActive && variant === "pill" && (
              <motion.div
                layoutId="slide-tab-pill"
                className="absolute inset-0 z-[-1] rounded-md bg-background shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {isActive && variant === "underline" && (
              <motion.div
                layoutId="slide-tab-underline"
                className="absolute inset-x-0 -bottom-px z-[-1] h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
