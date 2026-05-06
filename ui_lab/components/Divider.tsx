import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Divider/Separator** — visual content separator
 *
 * Supports:
 * - Horizontal/vertical orientation
 * - Text center option
 * - Custom colors
 * - Size variants
 *
 * Use: Content separation, section breaks
 */

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
  variant?: "default" | "muted" | "primary";
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      label,
      variant = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const variantMap = {
      default: "bg-border",
      muted: "bg-muted",
      primary: "bg-primary/20",
    };

    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-block h-6 w-px",
            variantMap[variant],
            className,
          )}
          {...(props as any)}
        />
      );
    }

    if (label) {
      return (
        <div className={cn("flex items-center gap-3", className)}>
          <hr
            ref={ref}
            className={cn("flex-1 border-t", variantMap[variant])}
            {...(props as any)}
          />
          <span className="text-sm text-muted-foreground">{label}</span>
          <hr
            className={cn("flex-1 border-t", variantMap[variant])}
          />
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        className={cn("border-t", variantMap[variant], className)}
        {...(props as any)}
      />
    );
  },
);

Divider.displayName = "Divider";
