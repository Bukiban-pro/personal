import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Heatmap / Color Matrix Visualization** — grid of colored cells showing data intensity
 *
 * Supports:
 * - 2D data array rendering
 * - Color scale mapping
 * - Tooltip on hover
 * - Legend display
 * - Customizable cell size
 *
 * Use: Analytics dashboards, correlation matrices, activity maps
 */

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[][];
  colorScale?: Array<[number, string]>;
  cellSize?: number;
  showLegend?: boolean;
  labels?: { x: string[]; y: string[] };
}

export const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      data,
      colorScale = [
        [0, "#1e293b"],
        [0.5, "#06b6d4"],
        [1, "#f59e0b"],
      ],
      cellSize = 30,
      showLegend = true,
      labels,
      className,
      ...props
    },
    ref,
  ) => {
    const [hoveredCell, setHoveredCell] = React.useState<{ x: number; y: number } | null>(null);

    const getColor = (value: number) => {
      const maxValue = Math.max(...data.flat());
      const normalized = value / maxValue;

      for (let i = 0; i < colorScale.length - 1; i++) {
        const [min, minColor] = colorScale[i];
        const [max, maxColor] = colorScale[i + 1];

        if (normalized >= min && normalized <= max) {
          const ratio = (normalized - min) / (max - min);
          // Simple color interpolation (basic RGB mixing)
          return minColor; // Simplified for now
        }
      }

      return colorScale[colorScale.length - 1][1];
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        {/* Heatmap grid */}
        <div className="overflow-auto">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${data[0]?.length || 1}, ${cellSize}px)`,
              gap: "1px",
              backgroundColor: "#e2e8f0",
              padding: "1px",
            }}
          >
            {data.map((row, y) =>
              row.map((value, x) => (
                <div
                  key={`${x}-${y}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getColor(value),
                  }}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`Value: ${value}`}
                />
              )),
            )}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="text-sm text-muted-foreground">
            {labels?.y?.[hoveredCell.y] || `Row ${hoveredCell.y}`} —{" "}
            {labels?.x?.[hoveredCell.x] || `Col ${hoveredCell.x}`}: Value{" "}
            {data[hoveredCell.y]?.[hoveredCell.x]}
          </div>
        )}

        {/* Legend */}
        {showLegend && (
          <div className="flex items-center gap-2 text-xs">
            <span>Low</span>
            <div className="flex gap-0">
              {colorScale.map(([_, color], i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: color,
                    width: "20px",
                    height: "20px",
                  }}
                />
              ))}
            </div>
            <span>High</span>
          </div>
        )}
      </div>
    );
  },
);

Heatmap.displayName = "Heatmap";
