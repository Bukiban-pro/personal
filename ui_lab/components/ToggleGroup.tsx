import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Toggle Group** — mutually exclusive toggle buttons
 *
 * Supports:
 * - Single/multiple selection modes
 * - Icon + text variants
 * - Size variants
 * - Disabled items
 * - Keyboard navigation
 *
 * Use: View mode selection, filter buttons, option groups
 */

export interface ToggleGroupItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ToggleGroupItem[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  type?: "single" | "multiple";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
}

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      items,
      value,
      onChange,
      type = "single",
      size = "md",
      variant = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const selectedValue = Array.isArray(value) ? value : value ? [value] : [];

    const handleToggle = (itemValue: string) => {
      if (type === "single") {
        onChange?.(itemValue);
      } else {
        const newValue = selectedValue.includes(itemValue)
          ? selectedValue.filter((v) => v !== itemValue)
          : [...selectedValue, itemValue];
        onChange?.(newValue);
      }
    };

    const sizeMap = {
      sm: "px-2 py-1.5 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-2.5 text-base",
    };

    return (
      <div
        ref={ref}
        className={cn("flex gap-1", className)}
        {...props}
      >
        {items.map((item) => {
          const isSelected = selectedValue.includes(item.value);

          return (
            <button
              key={item.value}
              onClick={() => !item.disabled && handleToggle(item.value)}
              disabled={item.disabled}
              className={cn(
                "flex items-center gap-1.5 rounded-lg font-medium transition-colors",
                sizeMap[size],
                isSelected
                  ? variant === "outline"
                    ? "bg-primary text-primary-foreground border border-primary"
                    : "bg-primary text-primary-foreground"
                  : variant === "outline"
                    ? "border border-border hover:border-primary"
                    : "bg-muted hover:bg-muted/80",
                item.disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);

ToggleGroup.displayName = "ToggleGroup";
