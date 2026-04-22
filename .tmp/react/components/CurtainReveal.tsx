"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface CurtainRevealProps {
  children: React.ReactNode
  /** Whether the curtain is open */
  isOpen: boolean
  /** Curtain direction */
  direction?: "horizontal" | "vertical"
  /** Curtain color */
  curtainColor?: string
  /** Duration in seconds */
  duration?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Curtain/wipe transition that reveals content underneath.
 * Two panels slide apart to reveal the content, like a theater curtain.
 * Used for page transitions, section reveals, and dramatic entrances.
 *
 * @example
 * const [open, setOpen] = useState(false)
 *
 * <button onClick={() => setOpen(true)}>Reveal</button>
 *
 * <CurtainReveal isOpen={open} direction="horizontal">
 *   <div className="p-12">
 *     <h2>Ta-da! 🎭</h2>
 *   </div>
 * </CurtainReveal>
 */
export function CurtainReveal({
  children,
  isOpen,
  direction = "horizontal",
  curtainColor = "bg-foreground",
  duration = 0.8,
  className,
}: CurtainRevealProps) {
  const isH = direction === "horizontal"

  const panelVariants = {
    closed: (side: "a" | "b") => ({
      [isH ? "x" : "y"]: "0%",
      ...(side === "a" ? {} : {}),
    }),
    open: (side: "a" | "b") => ({
      [isH ? "x" : "y"]: side === "a" ? "-100%" : "100%",
    }),
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Content underneath */}
      <div className="relative z-0">{children}</div>

      {/* Curtain panels */}
      <AnimatePresence>
        {!isOpen && (
          <>
            {/* Panel A (left/top) */}
            <motion.div
              custom="a"
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              exit="open"
              variants={panelVariants}
              transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
              className={cn(
                "absolute z-10",
                curtainColor,
                isH ? "inset-y-0 left-0 w-1/2" : "inset-x-0 top-0 h-1/2",
              )}
            />

            {/* Panel B (right/bottom) */}
            <motion.div
              custom="b"
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              exit="open"
              variants={panelVariants}
              transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
              className={cn(
                "absolute z-10",
                curtainColor,
                isH ? "inset-y-0 right-0 w-1/2" : "inset-x-0 bottom-0 h-1/2",
              )}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
