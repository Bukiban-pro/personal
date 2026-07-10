"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
type SortDirection = "asc" | "desc" | null

interface Column<T> {
  key: string
  header: string
  /** Custom cell renderer */
  cell?: (row: T, index: number) => React.ReactNode
  /** Enable sorting for this column */
  sortable?: boolean
  /** Custom sort comparator */
  sortFn?: (a: T, b: T) => number
  /** Column alignment */
  align?: "left" | "center" | "right"
  /** Column width class */
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  /** Unique key extractor for each row */
  getRowKey: (row: T) => string | number
  /** Enable client-side search */
  searchable?: boolean
  /** Placeholder text for search input */
  searchPlaceholder?: string
  /** Search filter function */
  searchFilter?: (row: T, query: string) => boolean
  /** Rows per page options */
  pageSizeOptions?: number[]
  /** Default page size */
  defaultPageSize?: number
  /** Empty state content */
  emptyMessage?: string
  /** Row click handler */
  onRowClick?: (row: T) => void
  /** Additional toolbar content (filters, actions) */
  toolbar?: React.ReactNode
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function DataTable<T>({
  data,
  columns,
  getRowKey,
  searchable = true,
  searchPlaceholder = "Search...",
  searchFilter,
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = 10,
  emptyMessage = "No results found.",
  onRowClick,
  toolbar,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDirection>(null)
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(defaultPageSize)

  // ── Filter ─────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    if (!search.trim() || !searchable) return data

    if (searchFilter) {
      return data.filter((row) => searchFilter(row, search))
    }

    // Default: stringify each row and do case-insensitive search
    const q = search.toLowerCase()
    return data.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(q),
    )
  }, [data, search, searchable, searchFilter])

  // ── Sort ───────────────────────────────────────────────────────────
  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered

    const col = columns.find((c) => c.key === sortKey)
    if (!col) return filtered

    return [...filtered].sort((a, b) => {
      if (col.sortFn) {
        return sortDir === "asc" ? col.sortFn(a, b) : col.sortFn(b, a)
      }

      const aVal = (a as Record<string, unknown>)[sortKey]
      const bVal = (b as Record<string, unknown>)[sortKey]

      if (aVal == null) return 1
      if (bVal == null) return -1

      const cmp =
        typeof aVal === "string"
          ? aVal.localeCompare(String(bVal))
          : Number(aVal) - Number(bVal)

      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, columns])

  // ── Paginate ───────────────────────────────────────────────────────
  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize)

  // Reset page on search/filter change
  React.useEffect(() => {
    setPage(0)
  }, [search, pageSize])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
      )
      if (sortDir === "desc") setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey)
      return <ArrowUpDown className="ml-1 size-3.5 opacity-40" />
    if (sortDir === "asc")
      return <ArrowUp className="ml-1 size-3.5" />
    return <ArrowDown className="ml-1 size-3.5" />
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {toolbar}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.width,
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.sortable && "cursor-pointer select-none",
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortable && <SortIcon columnKey={col.key} />}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, rowIdx) => (
                <TableRow
                  key={getRowKey(row)}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {col.cell
                        ? col.cell(row, page * pageSize + rowIdx)
                        : String(
                            (row as Record<string, unknown>)[col.key] ?? "",
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          {sorted.length === 0
            ? "0 results"
            : `Showing ${page * pageSize + 1}-${Math.min(
                (page + 1) * pageSize,
                sorted.length,
              )} of ${sorted.length}`}
        </p>

        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(0)}
              disabled={page === 0}
              aria-label="First page"
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              aria-label="Last page"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
