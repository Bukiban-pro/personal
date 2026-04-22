/**
 * PageLoading — Full-viewport centered loading spinner.
 *
 * Stolen from: Bookverse PageLoading — used as page-level suspense fallback.
 *
 * Dependencies: lucide-react, @/lib/utils (cn)
 *
 * @example
 * // As Next.js loading.tsx:
 * export default function Loading() { return <PageLoading /> }
 *
 * // With message:
 * <PageLoading message="Loading your dashboard..." />
 */

import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface PageLoadingProps {
  /** Optional message below spinner. */
  message?: string
  /** Additional classes on the container. */
  className?: string
}

export function PageLoading({ message, className }: PageLoadingProps) {
  return (
    <div
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center gap-4',
        className,
      )}
    >
      <Loader2 className="size-8 animate-spin text-primary" />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  )
}
