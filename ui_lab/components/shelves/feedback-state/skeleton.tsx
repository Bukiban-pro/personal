import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Skeleton Loader** — placeholder for loading states
 *
 * Supports:
 * - Shape variants: rect/circle/text
 * - Multiple skeleton arrangements
 * - Pulse animation
 * - Custom dimensions
 * - Accessibility-friendly
 *
 * Use: Content loading states, data fetching feedback
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "rectangular",
      width = "100%",
      height = "20px",
      animation = "pulse",
      className,
      ...props
    },
    ref,
  ) => {
    const shapeClass = {
      text: "rounded",
      circular: "rounded-full",
      rectangular: "rounded-lg",
    };

    const animationClass = {
      pulse: "animate-pulse",
      wave: "bg-gradient-to-r from-background via-muted to-background bg-[size:200%_100%] animate-[shimmer_2s_infinite]",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-muted",
          shapeClass[variant],
          animationClass[animation],
          className,
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
        aria-busy="true"
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

// ─── Skeleton Composition helper ──────────────────────────────────────────

export interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "card" | "user" | "text-block";
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ type = "card", className, ...props }) => {
  if (type === "card") {
    return (
      <div className={cn("space-y-3", className)} {...props}>
        <Skeleton height="200px" />
        <div className="space-y-2">
          <Skeleton height="20px" width="60%" />
          <Skeleton height="16px" width="80%" />
          <Skeleton height="16px" width="40%" />
        </div>
      </div>
    );
  }

  if (type === "user") {
    return (
      <div className={cn("flex gap-3", className)} {...props}>
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton height="16px" width="60%" />
          <Skeleton height="14px" width="40%" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Skeleton height="16px" width="100%" />
      <Skeleton height="16px" width="95%" />
      <Skeleton height="16px" width="85%" />
    </div>
  );
};

SkeletonGroup.displayName = "SkeletonGroup";
