"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface Accordion3DItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface Accordion3DProps {
  items: Accordion3DItem[]
  /** Allow multiple panels open */
  multiple?: boolean
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Accordion with 3D fold/unfold animation.
 * Panels appear to fold out from the trigger like a paper crease.
 * Uses CSS perspective + rotateX for the 3D fold effect.
 *
 * @example
 * <Accordion3D
 *   items={[
 *     { id: "1", title: "What is this?", content: <p>An awesome accordion.</p> },
 *     { id: "2", title: "How does it work?", content: <p>3D CSS transforms.</p> },
 *   ]}
 * />
 */
export function Accordion3D({
  items,
  multiple = false,
  className,
}: Accordion3DProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(multiple ? prev : [])
      if (prev.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={cn("divide-y divide-border rounded-xl border border-border", className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)

        return (
          <div key={item.id}>
            {/* Trigger */}
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/50"
              aria-expanded={isOpen}
            >
              {item.icon && (
                <span className="flex-shrink-0 text-muted-foreground">
                  {item.icon}
                </span>
              )}
              <span className="flex-1 font-medium text-foreground">
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground"
              >
                <ChevronDown className="size-4" />
              </motion.span>
            </button>

            {/* Content — 3D fold */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, rotateX: -90 }}
                  animate={{ height: "auto", opacity: 1, rotateX: 0 }}
                  exit={{ height: 0, opacity: 0, rotateX: -90 }}
                  transition={{
                    height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.25, delay: 0.1 },
                    rotateX: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                  }}
                  style={{
                    perspective: "600px",
                    transformOrigin: "top center",
                    overflow: "hidden",
                  }}
                >
                  <div className="px-5 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
