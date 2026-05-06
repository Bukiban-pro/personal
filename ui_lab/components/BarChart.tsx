import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Simple Bar Chart** — basic data visualization
 *
 * Supports:
 * - Horizontal/vertical bars
 * - Custom colors
 * - Animated entrance
 * - Value labels
 * - Responsive sizing
 *
 * Use: Stats, metrics, data comparison
 */

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartData[];
  maxValue?: number;
  variant?: "horizontal" | "vertical";
  showLabels?: boolean;
  animated?: boolean;
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      maxValue,
      variant = "horizontal",
      showLabels = true,
      animated = true,
      className,
      ...props
    },
    ref,
  ) => {
    const max = maxValue || Math.max(...data.map((d) => d.value));

    if (variant === "vertical") {
      return (
        <div
          ref={ref}
          className={cn("flex items-end gap-4 h-64", className)}
          {...props}
        >
          {data.map((item, i) => {
            const percentage = (item.value / max) * 100;
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-full bg-primary rounded-t transition-all",
                    animated && "animate-in duration-500",
                  )}
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: item.color,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
                {showLabels && (
                  <>
                    <span className="text-xs font-medium">{item.value}</span>
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Horizontal variant
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {data.map((item, i) => {
          const percentage = (item.value / max) * 100;
          return (
            <div key={i} className="flex items-center gap-3">
              {showLabels && (
                <span className="w-20 text-xs font-medium text-right truncate">
                  {item.label}
                </span>
              )}
              <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-primary rounded-full transition-all",
                    animated && "animate-in duration-500",
                  )}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              </div>
              {showLabels && (
                <span className="w-12 text-right text-xs font-medium">
                  {item.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

BarChart.displayName = "BarChart";
