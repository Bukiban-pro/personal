import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Radar Chart** — multi-axis polygon chart for comparing multiple metrics
 *
 * Supports:
 * - Multiple data series
 * - Customizable axes
 * - Animated transitions
 * - Legend + labels
 * - SVG rendering
 *
 * Use: Skills matrix, performance comparison, multi-dimensional data
 */

export interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{
    name: string;
    values: number[];
  }>;
  labels: string[];
  colors?: string[];
  maxValue?: number;
}

export const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      data,
      labels,
      colors = ["#06b6d4", "#f59e0b", "#ef4444"],
      maxValue = 100,
      className,
      ...props
    },
    ref,
  ) => {
    const numAxes = labels.length;
    const angleSlice = (Math.PI * 2) / numAxes;
    const radius = 150;

    const getCoordinates = (value: number, index: number) => {
      const angle = angleSlice * index - Math.PI / 2;
      const x = radius * (value / maxValue) * Math.cos(angle);
      const y = radius * (value / maxValue) * Math.sin(angle);
      return { x, y };
    };

    const getPathPoints = (values: number[]) => {
      return values
        .map((value, i) => {
          const coords = getCoordinates(value, i);
          return `${coords.x},${coords.y}`;
        })
        .join(" ");
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-4", className)}
        {...props}
      >
        <svg
          width="400"
          height="400"
          viewBox="-200 -200 400 400"
          className="overflow-visible"
        >
          {/* Grid circles */}
          {Array.from({ length: 5 }).map((_, i) => (
            <circle
              key={`grid-${i}`}
              cx="0"
              cy="0"
              r={(radius / 5) * (i + 1)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.2"
            />
          ))}

          {/* Axes */}
          {labels.map((label, i) => {
            const coords = getCoordinates(maxValue, i);
            return (
              <g key={`axis-${i}`}>
                <line
                  x1="0"
                  y1="0"
                  x2={coords.x}
                  y2={coords.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <text
                  x={coords.x * 1.1}
                  y={coords.y * 1.1}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Data polygons */}
          {data.map((series, i) => (
            <polygon
              key={`series-${i}`}
              points={getPathPoints(series.values)}
              fill={colors[i % colors.length]}
              fillOpacity="0.2"
              stroke={colors[i % colors.length]}
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap justify-center">
          {data.map((series, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-sm">{series.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

RadarChart.displayName = "RadarChart";
