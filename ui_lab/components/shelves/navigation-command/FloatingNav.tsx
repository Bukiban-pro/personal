"use client"

import * as React from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface FloatingNavProps {
  items: NavItem[]
  /** Show after scrolling this many pixels */
  showAfter?: number
  /** Active section detection (matches href hash) */
  activeSection?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Floating pill navigation that appears on scroll.
 * The signature creative portfolio nav — centered, minimal, animated.
 *
 * @example
 * <FloatingNav
 *   items={[
 *     { label: "About", href: "#about" },
 *     { label: "Work", href: "#work" },
 *     { label: "Contact", href: "#contact" },
 *   ]}
 * />
 */
export function FloatingNav({
  items,
  showAfter = 200,
  activeSection,
  className,
}: FloatingNavProps) {
  const { scrollY } = useScroll()
  const [visible, setVisible] = React.useState(false)
  const [lastScrollY, setLastScrollY] = React.useState(0)

  useMotionValueEvent(scrollY, "change", (current) => {
    // Show if scrolled past threshold
    if (current < showAfter) {
      setVisible(false)
    } else {
      // Show when scrolling up, hide when scrolling down fast
      const direction = current - lastScrollY
      setVisible(direction < 0 || Math.abs(direction) < 10)
    }
    setLastScrollY(current)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed left-1/2 top-4 z-50 -translate-x-1/2",
            className,
          )}
        >
          <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md">
            {items.map((item) => {
              const isActive = activeSection === item.href

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="floating-nav-active"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                </a>
              )
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
