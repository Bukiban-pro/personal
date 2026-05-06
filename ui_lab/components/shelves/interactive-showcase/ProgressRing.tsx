import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Progress Ring** — circular progress indicator with percentage
 *
 * Supports:
 * - Percentage value (0-100)
 * - Animated fill
 * - Color variants
 * - Size variants
 * - Inner label/text
 * - Stroke width control
 * - SVG rendering (crisp at any size)
 *
 * Use: File uploads, form completion, stats
 */

export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "success" | "warning" | "error";
  label?: string;
  animated?: boolean;
}

export const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  (
    {
      value,
      max = 100,
      size = 120,
      strokeWidth = 8,
      color = "primary",
      label,
      animated = true,
      className,
      ...props
    },
    ref,
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = (value / max) * 100;
    const offset = circumference - (percentage / 100) * circumference;

    const colorMap = {
      primary: "#3b82f6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    };

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        {...props}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={animated ? "transition-all duration-500 ease-out" : ""}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
          }}
        />

        {/* Inner text */}
        {label && (
          <text
            x={size / 2}
            y={size / 2 + 5}
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill="currentColor"
          >
            {percentage.toFixed(0)}%
          </text>
        )}
      </svg>
    );
  },
);

ProgressRing.displayName = "ProgressRing";
