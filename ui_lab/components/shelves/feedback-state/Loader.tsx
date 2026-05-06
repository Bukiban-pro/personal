import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Loader/Spinner Collection** — multiple loading indicators
 *
 * Supports:
 * - Spinner variants: default/dots/bars/pulse
 * - Size variants
 * - Color variants
 * - Text label option
 * - Full screen option
 *
 * Use: Loading states, async operations, data fetching
 */

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "spinner" | "dots" | "bars" | "pulse";
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      variant = "spinner",
      size = "md",
      label,
      fullScreen = false,
      className,
      ...props
    },
    ref,
  ) => {
    const sizeMap = {
      sm: "w-6 h-6",
      md: "w-10 h-10",
      lg: "w-16 h-16",
    };

    const loaderContent = () => {
      if (variant === "spinner") {
        return (
          <div
            className={cn(
              "border-2 border-muted border-t-primary rounded-full animate-spin",
              sizeMap[size],
            )}
          />
        );
      }

      if (variant === "dots") {
        return (
          <div className="flex gap-2 items-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-primary rounded-full animate-bounce"
                style={{
                  width: size === "sm" ? "4px" : size === "md" ? "8px" : "12px",
                  height: size === "sm" ? "4px" : size === "md" ? "8px" : "12px",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );
      }

      if (variant === "bars") {
        return (
          <div className="flex gap-1.5 items-end">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-primary rounded-sm animate-pulse"
                style={{
                  width: size === "sm" ? "3px" : size === "md" ? "5px" : "8px",
                  height: size === "sm" ? "12px" : size === "md" ? "20px" : "32px",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        );
      }

      if (variant === "pulse") {
        return (
          <div
            className={cn(
              "bg-primary rounded-full animate-pulse",
              sizeMap[size],
            )}
          />
        );
      }
    };

    const containerContent = (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center gap-3",
          className,
        )}
        {...props}
      >
        {loaderContent()}
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50 backdrop-blur-sm">
          {containerContent}
        </div>
      );
    }

    return containerContent;
  },
);

Loader.displayName = "Loader";
