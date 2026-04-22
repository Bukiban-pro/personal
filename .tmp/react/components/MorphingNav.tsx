"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface MorphingNavProps {
  /** Logo (small version for compact mode) */
  logo: React.ReactNode
  /** Navigation links */
  links: { label: string; href: string }[]
  /** Right-side actions */
  actions?: React.ReactNode
  /** Scroll threshold to switch to compact (px, default 100) */
  threshold?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Navigation bar that morphs between full and compact states on scroll.
 * Full state: transparent/wide, shows logo + links + actions.
 * Compact state: frosted glass pill that shrinks width and elevates.
 * The premium nav pattern from Apple, Vercel, Linear.
 *
 * @example
 * <MorphingNav
 *   logo={<Logo />}
 *   links={[
 *     { label: "Features", href: "#features" },
 *     { label: "Pricing", href: "#pricing" },
 *     { label: "Docs", href: "/docs" },
 *   ]}
 *   actions={<Button size="sm">Sign up</Button>}
 * />
 */
export function MorphingNav({
  logo,
  links,
  actions,
  threshold = 100,
  className,
}: MorphingNavProps) {
  const [isCompact, setIsCompact] = React.useState(false)

  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, threshold], [0, 1])

  React.useEffect(() => {
    return scrollY.on("change", (y) => setIsCompact(y > threshold))
  }, [scrollY, threshold])

  return (
    <motion.header
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-center transition-all duration-500",
        isCompact ? "px-4 py-3" : "px-6 py-4",
        className,
      )}
    >
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "flex items-center justify-between transition-all duration-500",
          isCompact
            ? "w-auto gap-1 rounded-full border border-border px-2 py-1 shadow-lg"
            : "w-full max-w-7xl gap-8",
        )}
        style={{
          backgroundColor: isCompact
            ? undefined
            : undefined,
        }}
      >
        {/* Glass background */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full backdrop-blur-xl"
          style={{
            opacity: bgOpacity,
            backgroundColor: "oklch(from var(--background) l c h / 80%)",
          }}
          aria-hidden
        />

        {/* Logo */}
        <div className="shrink-0">{logo}</div>

        {/* Links */}
        <ul
          className={cn(
            "flex items-center transition-all duration-300",
            isCompact ? "gap-0.5" : "gap-1",
          )}
        >
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={cn(
                  "rounded-full font-medium transition-colors hover:bg-accent",
                  isCompact
                    ? "px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                    : "px-3.5 py-1.5 text-sm text-foreground/80 hover:text-foreground",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        {actions && (
          <div
            className={cn(
              "shrink-0 transition-all duration-300",
              isCompact && "scale-90",
            )}
          >
            {actions}
          </div>
        )}
      </motion.nav>
    </motion.header>
  )
}
