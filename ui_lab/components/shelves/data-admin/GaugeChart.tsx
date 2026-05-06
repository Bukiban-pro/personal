import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Gauge Chart / Radial Gauge** — circular progress gauge with needle/arc
 *
 * Supports:
 * - Configurable min/max range
 * - Color zones (safe/warning/critical)
 * - Animated value transition
 * - SVG rendering
 *
 * Use: Dashboard metrics, performance indicators, speed/pressure displays
 */

export interface GaugeChartProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  zones?: Array<{ min: number; max: number; color: string }>;
}

export const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      label,
      unit,
      zones = [
        { min: 0, max: 33, color: "#10b981" },
        { min: 33, max: 66, color: "#f59e0b" },
        { min: 66, max: 100, color: "#ef4444" },
      ],
      className,
      ...props
    },
    ref,
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const angle = (percentage / 100) * 240 - 120; // 240 degree sweep

    const getZoneColor = () => {
      const zone = zones.find((z) => value >= z.min && value <= z.max);
      return zone?.color || "#06b6d4";
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center", className)}
        {...props}
      >
        <div className="relative w-48 h-48">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
          >
            {/* Background arc */}
            <path
              d="M 50 150 A 100 100 0 0 1 150 150"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              opacity="0.2"
            />

            {/* Zone arcs */}
            {zones.map((zone, i) => {
              const startAngle = ((zone.min - min) / (max - min)) * 240 - 120;
              const endAngle = ((zone.max - min) / (max - min)) * 240 - 120;

              const start = {
                x: 100 + 90 * Math.cos((startAngle * Math.PI) / 180),
                y: 100 + 90 * Math.sin((startAngle * Math.PI) / 180),
              };

              const end = {
                x: 100 + 90 * Math.cos((endAngle * Math.PI) / 180),
                y: 100 + 90 * Math.sin((endAngle * Math.PI) / 180),
              };

              return (
                <path
                  key={i}
                  d={`M ${start.x} ${start.y} A 90 90 0 0 1 ${end.x} ${end.y}`}
                  fill="none"
                  stroke={zone.color}
                  strokeWidth="10"
                  opacity="0.7"
                />
              );
            })}

            {/* Needle */}
            <line
              x1="100"
              y1="100"
              x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 70 * Math.sin((angle * Math.PI) / 180)}
              stroke={getZoneColor()}
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                transition: "all 0.5s ease-out",
              }}
            />

            {/* Center circle */}
            <circle cx="100" cy="100" r="8" fill={getZoneColor()} />
          </svg>
        </div>

        {label && (
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold">{value}</div>
            {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
            {label && <div className="text-xs text-muted-foreground mt-1">{label}</div>}
          </div>
        )}
      </div>
    );
  },
);

GaugeChart.displayName = "GaugeChart";
