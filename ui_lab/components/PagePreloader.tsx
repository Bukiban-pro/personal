"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface PagePreloaderProps {
  /** Whether loading is complete */
  isLoading: boolean
  /** Brand logo or icon */
  logo?: React.ReactNode
  /** Loading text */
  text?: string
  /** Exit animation duration in seconds */
  exitDuration?: number
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Cinematic page preloader with progress animation.
 * Fullscreen overlay that fades/slides away when loading completes.
 * The polished first impression from agency sites and luxury brands.
 *
 * @example
 * const [loading, setLoading] = useState(true)
 * useEffect(() => { setTimeout(() => setLoading(false), 2000) }, [])
 *
 * <PagePreloader
 *   isLoading={loading}
 *   logo={<img src="/logo.svg" className="h-12" />}
 *   text="Loading experience..."
 * />
 */
export function PagePreloader({
  isLoading,
  logo,
  text,
  exitDuration = 0.8,
  className,
}: PagePreloaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-5%" }}
          transition={{ duration: exitDuration, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-background",
            className,
          )}
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {logo}
            </motion.div>
          )}

          {/* Progress bar */}
          <div className="w-48 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-0.5 rounded-full bg-foreground"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.8,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </div>

          {/* Text */}
          {text && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
