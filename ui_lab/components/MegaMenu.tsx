"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface MegaMenuItem {
  label: string
  href?: string
  description?: string
  icon?: React.ReactNode
}

interface MegaMenuGroup {
  /** Trigger label in the navbar */
  trigger: string
  /** Columns of links in the dropdown */
  columns: MegaMenuItem[][]
  /** Optional featured section (right side) */
  featured?: {
    title: string
    description: string
    image?: string
    href?: string
  }
}

interface MegaMenuProps {
  groups: MegaMenuGroup[]
  /** Logo or brand element */
  logo?: React.ReactNode
  /** Right-side action buttons */
  actions?: React.ReactNode
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Stripe-style mega dropdown navigation.
 * Hovering a nav item reveals a content panel that smoothly transitions
 * between groups with shared layoutId animation. The panel resizes and
 * cross-fades content — exactly like Stripe's marketing nav.
 *
 * @example
 * <MegaMenu
 *   logo={<Logo />}
 *   groups={[
 *     {
 *       trigger: "Products",
 *       columns: [
 *         [
 *           { label: "Payments", description: "Accept payments", icon: <CreditCard /> },
 *           { label: "Billing", description: "Manage subscriptions", icon: <Receipt /> },
 *         ],
 *       ],
 *       featured: { title: "New", description: "Check out Atlas", href: "/atlas" },
 *     },
 *   ]}
 *   actions={<Button>Sign in</Button>}
 * />
 */
export function MegaMenu({ groups, logo, actions, className }: MegaMenuProps) {
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  const handleEnter = (trigger: string) => {
    clearTimeout(timeoutRef.current)
    setActiveGroup(trigger)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveGroup(null), 150)
  }

  const active = groups.find((g) => g.trigger === activeGroup)

  return (
    <nav
      className={cn(
        "relative z-50 flex h-16 items-center justify-between border-b border-border bg-background px-6",
        className,
      )}
      onMouseLeave={handleLeave}
    >
      {/* Logo */}
      {logo && <div className="shrink-0">{logo}</div>}

      {/* Trigger items */}
      <ul className="flex items-center gap-1">
        {groups.map((group) => (
          <li key={group.trigger} onMouseEnter={() => handleEnter(group.trigger)}>
            <button
              type="button"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activeGroup === group.trigger
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {group.trigger}
            </button>
          </li>
        ))}
      </ul>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {/* Dropdown panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="mega-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            onMouseEnter={() => handleEnter(active.trigger)}
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.trigger}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex gap-8 p-6"
                >
                  {/* Columns */}
                  <div className="flex gap-8">
                    {active.columns.map((col, ci) => (
                      <div key={ci} className="flex min-w-[200px] flex-col gap-1">
                        {col.map((item) => (
                          <a
                            key={item.label}
                            href={item.href ?? "#"}
                            className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent"
                          >
                            {item.icon && (
                              <div className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground">
                                {item.icon}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Featured section */}
                  {active.featured && (
                    <div className="flex min-w-[220px] flex-col justify-between rounded-lg bg-accent/50 p-5">
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {active.featured.title}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {active.featured.description}
                        </p>
                      </div>
                      {active.featured.image && (
                        <img
                          src={active.featured.image}
                          alt=""
                          className="mt-4 rounded-md"
                          loading="lazy"
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
