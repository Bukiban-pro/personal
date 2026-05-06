import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Real-time Metrics Dashboard** — live updating KPI display
 *
 * Supports:
 * - Multiple metric cards
 * - Sparkline mini-charts
 * - Up/down trend indicators
 * - Color-coded alerts
 * - Configurable update interval
 *
 * Use: Analytics dashboards, monitoring tools, operational displays
 */

export interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  color?: "primary" | "success" | "warning" | "error";
  history?: number[];
}

export interface MetricsDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: Metric[];
  columns?: number;
}

export const MetricsDashboard = React.forwardRef<HTMLDivElement, MetricsDashboardProps>(
  (
    {
      metrics,
      columns = 4,
      className,
      ...props
    },
    ref,
  ) => {
    const colorMap = {
      primary: "bg-blue-500/20 border-blue-500/50",
      success: "bg-green-500/20 border-green-500/50",
      warning: "bg-yellow-500/20 border-yellow-500/50",
      error: "bg-red-500/20 border-red-500/50",
    };

    const trendColors = {
      up: "text-green-500",
      down: "text-red-500",
      neutral: "text-gray-500",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4",
          `grid-cols-${columns}`,
          className,
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
        {...props}
      >
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={cn(
              "p-4 rounded-lg border",
              colorMap[metric.color || "primary"],
            )}
          >
            <div className="text-xs font-medium text-muted-foreground mb-2">
              {metric.label}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {metric.value}
                  {metric.unit && <span className="text-sm">{metric.unit}</span>}
                </div>

                {metric.trend && metric.trendValue !== undefined && (
                  <div className={cn("text-xs font-medium", trendColors[metric.trend])}>
                    {metric.trend === "up" ? "↑" : "↓"} {metric.trendValue}%
                  </div>
                )}
              </div>

              {metric.history && metric.history.length > 1 && (
                <svg
                  width="60"
                  height="30"
                  className="ml-2"
                  viewBox="0 0 60 30"
                >
                  <polyline
                    points={metric.history
                      .map(
                        (v, i) =>
                          `${(i / (metric.history!.length - 1)) * 60},${30 - (v / Math.max(...metric.history!)) * 25}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

MetricsDashboard.displayName = "MetricsDashboard";
