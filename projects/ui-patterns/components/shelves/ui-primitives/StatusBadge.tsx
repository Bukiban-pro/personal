import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Status Badge** — status indicator with icon, color, and animation
 *
 * Supports:
 * - Status types: info/success/warning/error/pending
 * - Icon support
 * - Animated pulse (for pending/active states)
 * - Size variants
 * - Dismiss option
 * - Custom color mapping
 *
 * Use: Status indicators, tags, labels, state badges
 */

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "info" | "success" | "warning" | "error" | "pending";
  label: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  (
    {
      status = "info",
      label,
      icon,
      size = "md",
      pulse = false,
      dismissible = false,
      onDismiss,
      className,
      ...props
    },
    ref,
  ) => {
    const [isDismissed, setIsDismissed] = React.useState(false);

    if (isDismissed) return null;

    const statusColorMap = {
      info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
      success: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
      warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
      error: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
      pending: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30",
    };

    const dotColorMap = {
      info: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
      pending: "bg-gray-500",
    };

    const sizeMap = {
      sm: "px-2 py-1 text-xs gap-1",
      md: "px-2.5 py-1.5 text-sm gap-1.5",
      lg: "px-3 py-2 text-base gap-2",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium",
          statusColorMap[status],
          sizeMap[size],
          pulse && "animate-pulse",
          className,
        )}
        {...props}
      >
        {icon ? (
          <span>{icon}</span>
        ) : (
          <div className={cn("w-2 h-2 rounded-full", dotColorMap[status])} />
        )}
        <span>{label}</span>
        {dismissible && (
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss?.();
            }}
            className="ml-1 hover:opacity-70"
          >
            ✕
          </button>
        )}
      </div>
    );
  },
);

StatusBadge.displayName = "StatusBadge";
