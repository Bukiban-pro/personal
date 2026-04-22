"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useLockScroll } from "@/hooks/useLockScroll"

// ── Props ──────────────────────────────────────────────────────────────
interface ExpandableCardProps {
  children: React.ReactNode
  /** Expanded content (full modal view) */
  expandedContent: React.ReactNode
  /** Card ID for layout animation */
  id: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Card that expands into a full-screen modal with shared layout animation.
 * The "click to expand" card pattern from Apple Wallet, Airbnb, Pinterest.
 * Uses Framer Motion layoutId for smooth morphing between states.
 *
 * @example
 * <ExpandableCard
 *   id="project-1"
 *   expandedContent={
 *     <div className="p-8">
 *       <h2>Full project details...</h2>
 *       <p>Long description...</p>
 *     </div>
 *   }
 * >
 *   <div className="p-4">
 *     <h3>Project Name</h3>
 *     <p>Short description</p>
 *   </div>
 * </ExpandableCard>
 */
export function ExpandableCard({
  children,
  expandedContent,
  id,
  className,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  useLockScroll(isExpanded)

  return (
    <>
      {/* Card (collapsed) */}
      <motion.div
        layoutId={`card-${id}`}
        onClick={() => setIsExpanded(true)}
        className={cn(
          "cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg",
          className,
        )}
        style={{ borderRadius: "12px" }}
      >
        <motion.div layoutId={`card-content-${id}`}>{children}</motion.div>
      </motion.div>

      {/* Expanded modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            />

            {/* Expanded card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                layoutId={`card-${id}`}
                className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
                style={{ borderRadius: "16px" }}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>

                <motion.div layoutId={`card-content-${id}`}>
                  {children}
                </motion.div>

                {/* Additional expanded content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {expandedContent}
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
