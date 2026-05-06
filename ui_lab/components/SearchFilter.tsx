import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Search & Filter UI** — search bar with filters
 *
 * Supports:
 * - Search input
 * - Filter button/dropdown
 * - Sort options
 * - Clear button
 * - Results counter
 * - Debounced search
 *
 * Use: Data filtering, search interfaces, admin panels
 */

export interface SearchFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  onSort?: (by: string) => void;
  filters?: Array<{ label: string; value: string }>;
  sortOptions?: Array<{ label: string; value: string }>;
  resultCount?: number;
  loading?: boolean;
}

export const SearchFilter = React.forwardRef<HTMLDivElement, SearchFilterProps>(
  (
    {
      searchPlaceholder = "Search...",
      onSearch,
      onFilter,
      onSort,
      filters = [],
      sortOptions = [],
      resultCount,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState(sortOptions[0]?.value || "");
    const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

    const handleSearchChange = (value: string) => {
      setSearchQuery(value);
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        onSearch?.(value);
      }, 300);
    };

    const handleClear = () => {
      setSearchQuery("");
      onSearch?.("");
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border", className)}
        {...props}
      >
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-muted-foreground">🔍</span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort */}
        {sortOptions.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              onSort?.(e.target.value);
            }}
            className="px-2 py-1 rounded border border-border bg-background text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Filter */}
        {filters.length > 0 && (
          <button
            onClick={onFilter}
            className="px-3 py-1.5 rounded border border-border hover:bg-muted text-sm"
          >
            Filter
          </button>
        )}

        {/* Results */}
        {resultCount !== undefined && (
          <span className="text-xs text-muted-foreground">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    );
  },
);

SearchFilter.displayName = "SearchFilter";
