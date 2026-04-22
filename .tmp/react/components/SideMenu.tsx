"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useLockScroll } from "@/hooks/useLockScroll"

// ── Types ──────────────────────────────────────────────────────────────
interface SideMenuItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface SideMenuProps {
  items: SideMenuItem[]
  /** Position */
  side?: "left" | "right"
  /** Header content (logo, close button auto-included) */
  header?: React.ReactNode
  /** Footer content */
  footer?: React.ReactNode
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Off-canvas side menu with staggered item entrance.
 * The premium mobile menu / overlay menu with cinematic stagger.
 *
 * @example
 * <SideMenu
 *   items={[
 *     { label: "Home", href: "/", icon: <Home /> },
 *     { label: "About", href: "/about", icon: <Info /> },
 *     { label: "Contact", href: "/contact", icon: <Mail /> },
 *   ]}
 *   header={<Logo />}
 *   footer={<SocialLinks />}
 * />
 */
export function SideMenu({
  items,
  side = "right",
  header,
  footer,
  className,
}: SideMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  useLockScroll(isOpen)

  const slideFrom = side === "right" ? "100%" : "-100%"

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md p-2 text-foreground transition-colors hover:bg-accent"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              aria-hidden
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: slideFrom }}
              animate={{ x: 0 }}
              exit={{ x: slideFrom }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "fixed top-0 z-50 flex h-full w-80 flex-col bg-background shadow-2xl",
                side === "right" ? "right-0" : "left-0",
                className,
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-5">
                {header}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Items — staggered */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: side === "right" ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1 + i * 0.05,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {item.icon && (
                          <span className="text-muted-foreground">{item.icon}</span>
                        )}
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              {footer && (
                <div className="border-t border-border p-5">{footer}</div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
