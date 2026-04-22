/**
 * Pagination — Smart page navigation with ellipsis, info bar, and page-size selector.
 *
 * Stolen from: Bookverse pagination.tsx — generatePaginationRange algorithm,
 * Pagination component, PaginationInfo ("Showing 1-10 of 42"), PageSizeSelector.
 *
 * Dependencies: lucide-react, @/components/ui/button, @/lib/utils (cn)
 *
 * @example
 * <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
 * <PaginationInfo currentPage={1} pageSize={10} totalItems={42} />
 * <PageSizeSelector pageSize={size} onPageSizeChange={setSize} />
 */

'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Pagination Range Algorithm ─────────────────────

/**
 * Generate page numbers with ellipsis placeholders.
 * Always shows first, last, and a window around current page.
 *
 * @example
 * generatePaginationRange(5, 20) // [1, '...', 4, 5, 6, '...', 20]
 * generatePaginationRange(1, 5)  // [1, 2, 3, 4, 5]
 */
export function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): (number | '...')[] {
  const totalPageNumbers = siblingCount * 2 + 5 // siblings + first + last + current + 2 ellipsis

  // If total pages fits without ellipsis
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const showLeftDots = leftSiblingIndex > 2
  const showRightDots = rightSiblingIndex < totalPages - 1

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1)
    return [...leftRange, '...', totalPages]
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + 2 * siblingCount },
      (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1,
    )
    return [1, '...', ...rightRange]
  }

  // Both dots
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  )
  return [1, '...', ...middleRange, '...', totalPages]
}

// ─── Pagination Component ───────────────────────────

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = generatePaginationRange(currentPage, totalPages, siblingCount)

  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`dots-${idx}`}
            className="flex size-8 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}

// ─── Pagination Info ────────────────────────────────

interface PaginationInfoProps {
  currentPage: number
  pageSize: number
  totalItems: number
  className?: string
}

/**
 * "Showing 1-10 of 42 results" info text.
 */
export function PaginationInfo({ currentPage, pageSize, totalItems, className }: PaginationInfoProps) {
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      Showing <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> of{' '}
      <span className="font-medium">{totalItems}</span> results
    </p>
  )
}

// ─── Page Size Selector ─────────────────────────────

interface PageSizeSelectorProps {
  pageSize: number
  onPageSizeChange: (size: number) => void
  options?: number[]
  className?: string
}

export function PageSizeSelector({
  pageSize,
  onPageSizeChange,
  options = [10, 20, 50, 100],
  className,
}: PageSizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="text-muted-foreground">Rows per page</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
