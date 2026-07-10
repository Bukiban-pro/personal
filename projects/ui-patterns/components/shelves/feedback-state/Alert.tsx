import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Alert Component** — contextual notification boxes
 *
 * Supports:
 * - Alert types: info/success/warning/error
 * - Icon + title + description layout
 * - Action buttons
 * - Dismissible
 * - Animated entrance/exit
 *
 * Use: Important messages, contextual information, validation feedback
 */

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = "info",
      icon,
      title,
      description,
      action,
      dismissible = false,
      onDismiss,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [isDismissed, setIsDismissed] = React.useState(false);

    if (isDismissed) return null;

    const typeMap = {
      info: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        icon: "ℹ",
      },
      success: {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        icon: "✓",
      },
      warning: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        icon: "⚠",
      },
      error: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        icon: "✕",
      },
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-top-2",
          typeMap[type].bg,
          typeMap[type].border,
          className,
        )}
        {...props}
      >
        <div className="flex-shrink-0 text-lg mt-0.5">
          {icon || typeMap[type].icon}
        </div>

        <div className="flex-1">
          {title && <div className="font-medium">{title}</div>}
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
          {children}

          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {dismissible && (
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss?.();
            }}
            className="text-muted-foreground hover:text-foreground ml-2"
          >
            ✕
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
