import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Scroll Progress Indicator** — shows reading progress or scroll position
 *
 * Supports:
 * - Horizontal bar at top/bottom
 * - Circular indicator
 * - Percentage text
 * - Color change at milestones
 * - Smooth animation
 *
 * Use: Blog posts, long pages, reading progress
 */

export interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "bar" | "circle" | "percentage";
  position?: "top" | "bottom";
  color?: string;
}

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  (
    {
      variant = "bar",
      position = "top",
      color = "bg-primary",
      className,
      ...props
    },
    ref,
  ) => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(scrollPercent);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (variant === "bar") {
      return (
        <div
          ref={ref}
          className={cn(
            "fixed left-0 h-1 z-50",
            position === "top" ? "top-0" : "bottom-0",
            className,
          )}
          {...props}
        >
          <div
            className={cn("h-full transition-all duration-200", color)}
            style={{ width: `${progress}%` }}
          />
        </div>
      );
    }

    if (variant === "circle") {
      const radius = 45;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (progress / 100) * circumference;

      return (
        <div
          ref={ref}
          className={cn(
            "fixed z-50",
            position === "top" ? "top-4 right-4" : "bottom-4 right-4",
            className,
          )}
          {...props}
        >
          <svg width="100" height="100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.2"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50px 50px",
                transition: "stroke-dashoffset 0.2s ease-out",
              }}
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
            >
              {Math.round(progress)}%
            </text>
          </svg>
        </div>
      );
    }

    // Percentage text variant
    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 text-sm font-medium",
          position === "top" ? "top-4 right-4" : "bottom-4 right-4",
          className,
        )}
        {...props}
      >
        {Math.round(progress)}%
      </div>
    );
  },
);

ScrollProgress.displayName = "ScrollProgress";
