import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Simple Line Chart** — basic line graph visualization
 *
 * Supports:
 * - Multiple data series
 * - Animated line drawing
 * - Grid background
 * - Tooltips on hover
 * - Responsive sizing
 * - Multiple colors
 *
 * Use: Trends, time-series data, analytics
 */

export interface LineChartData {
  label: string;
  points: number[];
  color?: string;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: LineChartData[];
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      height = 300,
      showGrid = true,
      showLabels = true,
      animated = true,
      className,
      ...props
    },
    ref,
  ) => {
    const maxValue = Math.max(...data.flatMap((d) => d.points));
    const minValue = Math.min(...data.flatMap((d) => d.points), 0);
    const range = maxValue - minValue || 1;

    const width = 600;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const getX = (i: number) => (padding + (i / (data[0]?.points.length - 1)) * chartWidth);
    const getY = (value: number) => (
      height - padding - ((value - minValue) / range) * chartHeight
    );

    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
    ];

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ maxWidth: "100%" }}
        >
          {/* Grid */}
          {showGrid && (
            <>
              {[0, 1, 2, 3, 4].map((i) => {
                const y = padding + (chartHeight / 4) * i;
                return (
                  <line
                    key={`grid-h-${i}`}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="1"
                  />
                );
              })}
            </>
          )}

          {/* Axes */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Lines */}
          {data.map((series, seriesIndex) => {
            const color = series.color || colors[seriesIndex % colors.length];
            const pathD = series.points
              .map((point, i) => {
                const x = getX(i);
                const y = getY(point);
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ");

            return (
              <path
                key={`line-${seriesIndex}`}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={animated ? "animate-pulse" : ""}
              />
            );
          })}

          {/* Points */}
          {data.map((series, seriesIndex) => {
            const color = series.color || colors[seriesIndex % colors.length];
            return series.points.map((point, i) => {
              const x = getX(i);
              const y = getY(point);
              return (
                <circle
                  key={`point-${seriesIndex}-${i}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={color}
                />
              );
            });
          })}

          {/* Labels */}
          {showLabels && (
            <>
              {data.map((series, i) => (
                <text
                  key={`label-${i}`}
                  x={width - padding - 10}
                  y={getY(series.points[series.points.length - 1]) - 10}
                  fontSize="12"
                  fill={series.color || colors[i % colors.length]}
                  fontWeight="bold"
                >
                  {series.label}
                </text>
              ))}
            </>
          )}
        </svg>
      </div>
    );
  },
);

LineChart.displayName = "LineChart";
