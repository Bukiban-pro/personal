/**
 * TopLoadingBar — Thin progress bar at top of viewport for page transitions.
 *
 * Stolen from: pattern observed across Bookverse + ChefKix (NProgress-style).
 * Implemented as pure React + CSS — no external library needed.
 *
 * Dependencies: @/lib/utils (cn)
 *
 * @example
 * // In root layout:
 * <TopLoadingBar isLoading={isNavigating} />
 *
 * // Or with Next.js App Router:
 * // Use with usePathname() changes to detect navigation.
 */

'use client'

import { useEffect, useState, useRef } from 'react'

import { cn } from '@/lib/utils'

interface TopLoadingBarProps {
  /** Whether loading is active. */
  isLoading: boolean
  /** Bar color (defaults to --primary via Tailwind). */
  className?: string
  /** Estimated duration in ms for the slow-crawl phase (default: 8000). */
  estimatedDuration?: number
}

export function TopLoadingBar({
  isLoading,
  className,
  estimatedDuration = 8000,
}: TopLoadingBarProps) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isLoading) {
      setVisible(true)
      setProgress(0)

      // Rapidly go to 20%, then slow crawl to 90%
      let current = 0
      intervalRef.current = setInterval(() => {
        current += current < 20 ? 5 : current < 50 ? 2 : current < 80 ? 0.5 : 0.1
        if (current >= 90) {
          current = 90
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        setProgress(current)
      }, estimatedDuration / 100)
    } else if (visible) {
      // Complete: jump to 100%, then hide
      if (intervalRef.current) clearInterval(intervalRef.current)
      setProgress(100)
      const timeout = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
      return () => clearTimeout(timeout)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isLoading, estimatedDuration, visible])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5" role="progressbar" aria-valuenow={Math.round(progress)}>
      <div
        className={cn(
          'h-full bg-primary transition-all duration-300 ease-out',
          progress === 100 && 'opacity-0 transition-opacity duration-300',
          className,
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
