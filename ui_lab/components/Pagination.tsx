import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Pagination Component** — navigation for paginated content
 *
 * Supports:
 * - Page navigation (prev/next/numbered)
 * - Jump to page
 * - Results per page selector
 * - Page size options
 * - Disabled state
 *
 * Use: Data tables, search results, listings
 */

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      pageSize = 10,
      pageSizeOptions = [10, 25, 50, 100],
      onPageSizeChange,
      showPageSize = false,
      className,
      ...props
    },
    ref,
  ) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) rangeWithDots.push("...");
      rangeWithDots.push(1);
      rangeWithDots.push(...range);
      if (currentPage + delta < totalPages - 1) rangeWithDots.push("...");
      if (totalPages > 1) rangeWithDots.push(totalPages);

      return rangeWithDots;
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between gap-4", className)}
        {...props}
      >
        {/* Page Size */}
        {showPageSize && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value))}
              className="px-2 py-1 text-sm border border-border rounded bg-background"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..." || page === currentPage}
              className={cn(
                "px-2 py-1 rounded border",
                page === currentPage
                  ? "bg-primary text-primary-foreground border-primary"
                  : page === "..."
                    ? "border-transparent cursor-default"
                    : "border-border hover:bg-muted",
              )}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>

        {/* Info */}
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";
