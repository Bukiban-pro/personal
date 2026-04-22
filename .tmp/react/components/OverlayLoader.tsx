/**
 * OverlayLoader — Fixed overlay with centered spinner and scroll lock.
 *
 * Stolen from: Bookverse loader pattern — used during full-page async operations
 * (checkout processing, file uploads, etc.)
 *
 * Dependencies: @/lib/utils (cn)
 *
 * @example
 * {isProcessing && <OverlayLoader message="Processing payment..." />}
 */

'use client'

import { useEffect } from 'react'

import { cn } from '@/lib/utils'

interface OverlayLoaderProps {
  /** Optional message below spinner. */
  message?: string
  /** Additional classes on the overlay. */
  className?: string
}

export function OverlayLoader({ message, className }: OverlayLoaderProps) {
  // Lock body scroll while overlay is visible
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm',
        className,
      )}
      role="status"
      aria-label={message || 'Loading'}
    >
      {/* CSS-only spinner — no icon dependency */}
      <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      {message && (
        <p className="text-sm font-medium text-foreground">{message}</p>
      )}
    </div>
  )
}
