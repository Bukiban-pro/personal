import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Input with Addons** — input field with prefix/suffix decorators
 *
 * Supports:
 * - Prefix/suffix text or icons
 * - Prefix/suffix actions (buttons)
 * - Error states
 * - Size variants
 * - Disabled state
 * - Character counter
 *
 * Use: Phone numbers, prices, search with buttons, email with verify button
 */

export interface InputAddonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  prefix?: React.ReactNode;
  prefixAction?: () => void;
  suffix?: React.ReactNode;
  suffixAction?: () => void;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
}

export const InputAddon = React.forwardRef<HTMLInputElement, InputAddonProps>(
  (
    {
      prefix,
      prefixAction,
      suffix,
      suffixAction,
      error,
      helperText,
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId();

    const sizeMap = {
      sm: "px-2.5 py-1.5 text-sm h-8",
      md: "px-3 py-2 text-sm h-10",
      lg: "px-4 py-2.5 text-base h-12",
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
          {prefix && (
            <button
              type="button"
              onClick={prefixAction}
              disabled={!prefixAction}
              className={cn(
                "flex items-center justify-center px-3 text-foreground/50",
                prefixAction && "cursor-pointer hover:text-foreground",
              )}
            >
              {prefix}
            </button>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex-1 bg-transparent outline-none",
              sizeMap[size],
              prefix && "pl-0",
              suffix && "pr-0",
              className,
            )}
            {...props}
          />

          {suffix && (
            <button
              type="button"
              onClick={suffixAction}
              disabled={!suffixAction}
              className={cn(
                "flex items-center justify-center px-3 text-foreground/50",
                suffixAction && "cursor-pointer hover:text-foreground",
              )}
            >
              {suffix}
            </button>
          )}
        </div>

        {(error || helperText) && (
          <div className={cn(error ? "text-red-500" : "text-muted-foreground", "text-xs")}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

InputAddon.displayName = "InputAddon";
