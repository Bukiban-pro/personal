import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Data Table** — sortable, filterable table
 *
 * Supports:
 * - Column-based sorting
 * - Row selection checkboxes
 * - Expandable rows (details)
 * - Empty state
 * - Loading skeleton
 * - Responsive horizontal scroll
 * - Sticky header
 *
 * Use: Data display, admin panels, dashboards
 */

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface TableRow {
  id: string;
  [key: string]: any;
  details?: React.ReactNode;
}

export interface AdvancedDataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn[];
  rows: TableRow[];
  onRowSelect?: (ids: string[]) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  selectable?: boolean;
  expandable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export const AdvancedDataTable = React.forwardRef<HTMLDivElement, AdvancedDataTableProps>(
  (
    {
      columns,
      rows,
      onRowSelect,
      onSort,
      selectable = false,
      expandable = false,
      loading = false,
      emptyMessage = "No data available",
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
    const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = React.useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);

    const toggleRowSelection = (id: string) => {
      const newSelected = new Set(selectedRows);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedRows(newSelected);
      onRowSelect?.(Array.from(newSelected));
    };

    const toggleRowExpansion = (id: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      setExpandedRows(newExpanded);
    };

    const handleSort = (key: string) => {
      const newDirection =
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key, direction: newDirection });
      onSort?.(key, newDirection);
    };

    return (
      <div
        ref={ref}
        className={cn("overflow-x-auto border border-border rounded-lg", className)}
        {...props}
      >
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-muted/50 sticky top-0 border-b border-border">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === rows.length && rows.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(new Set(rows.map((r) => r.id)));
                        onRowSelect?.(rows.map((r) => r.id));
                      } else {
                        setSelectedRows(new Set());
                        onRowSelect?.([]);
                      }
                    }}
                  />
                </th>
              )}

              {expandable && <th className="px-4 py-3 w-12" />}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left font-medium",
                    col.sortable && "cursor-pointer hover:bg-muted/70",
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortConfig?.key === col.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} className="px-4 py-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(row.id)}
                          onChange={() => toggleRowSelection(row.id)}
                        />
                      </td>
                    )}

                    {expandable && (
                      <td className="px-4 py-3">
                        {row.details && (
                          <button
                            onClick={() => toggleRowExpansion(row.id)}
                            className="text-lg"
                          >
                            {expandedRows.has(row.id) ? "▼" : "▶"}
                          </button>
                        )}
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>

                  {/* Expansion */}
                  {expandable && expandedRows.has(row.id) && row.details && (
                    <tr className="bg-muted/20">
                      <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} className="px-4 py-3">
                        {row.details}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);

AdvancedDataTable.displayName = "AdvancedDataTable";
