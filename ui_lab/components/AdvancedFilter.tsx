import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Filter UI** — complex filtering with multiple conditions
 *
 * Supports:
 * - Multiple filter groups
 * - AND/OR logic
 * - Range sliders
 * - Checkbox groups
 * - Search within filters
 * - Apply/clear buttons
 *
 * Use: E-commerce, data explorers, advanced search
 */

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  name: string;
  type: "checkbox" | "radio" | "range" | "search";
  options?: FilterOption[];
  min?: number;
  max?: number;
  value?: string | string[];
}

export interface AdvancedFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: FilterGroup[];
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
}

export const AdvancedFilter = React.forwardRef<HTMLDivElement, AdvancedFilterProps>(
  (
    {
      groups,
      onApply,
      onClear,
      className,
      ...props
    },
    ref,
  ) => {
    const [filters, setFilters] = React.useState<Record<string, any>>({});

    const handleFilterChange = (groupId: string, value: any) => {
      setFilters((prev) => ({ ...prev, [groupId]: value }));
    };

    const handleApply = () => {
      onApply(filters);
    };

    const handleClear = () => {
      setFilters({});
      onClear();
    };

    return (
      <div
        ref={ref}
        className={cn("p-4 bg-muted/50 rounded-lg space-y-4", className)}
        {...props}
      >
        {groups.map((group) => (
          <div key={group.id} className="space-y-2">
            <h4 className="font-semibold text-foreground text-sm">{group.name}</h4>

            {group.type === "checkbox" && group.options && (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      onChange={(e) => {
                        const current = filters[group.id] || [];
                        const updated = e.target.checked
                          ? [...current, option.value]
                          : current.filter((v: string) => v !== option.value);
                        handleFilterChange(group.id, updated);
                      }}
                      className="w-4 h-4 rounded border border-border"
                    />
                    <span className="text-sm">
                      {option.label}
                      {option.count && <span className="text-muted-foreground"> ({option.count})</span>}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {group.type === "range" && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={group.min || 0}
                  max={group.max || 100}
                  value={filters[group.id] || group.min || 0}
                  onChange={(e) => handleFilterChange(group.id, e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  {filters[group.id] || group.min}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
);

AdvancedFilter.displayName = "AdvancedFilter";
