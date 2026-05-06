import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Toggle** — On/Off switch with label + description
 *
 * Supports:
 * - Single toggle state
 * - Disabled state
 * - Error states
 * - Size variants (sm/md/lg)
 * - Icon/badge in label
 * - Description text
 * - Loading state (spinner inside toggle)
 *
 * Use with `react-hook-form` via `{...register()}` or controlled.
 */

export interface FormToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const FormToggle = React.forwardRef<HTMLInputElement, FormToggleProps>(
  (
    {
      label,
      description,
      error,
      size = "md",
      loading = false,
      icon,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const id = React.useId();

    const sizeStyles = {
      sm: "h-5 w-9",
      md: "h-6 w-11",
      lg: "h-7 w-13",
    };

    const toggleStyles = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <label
          htmlFor={id}
          className={cn(
            "relative inline-flex items-center cursor-pointer mt-1",
            disabled || loading ? "opacity-50 cursor-not-allowed" : "",
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            id={id}
            disabled={disabled || loading}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "bg-muted rounded-full transition-colors peer-checked:bg-primary",
              sizeStyles[size],
            )}
          />
          <div
            className={cn(
              "absolute bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5",
              toggleStyles[size],
              size === "sm" && "left-0.5 top-0.5 peer-checked:translate-x-4",
              size === "md" && "left-0.5 top-0.5 peer-checked:translate-x-5",
              size === "lg" && "left-0.5 top-0.5 peer-checked:translate-x-6",
            )}
          >
            {loading && (
              <div className="w-full h-full flex items-center justify-center animate-spin">
                ⟳
              </div>
            )}
          </div>
        </label>

        {(label || description || error) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
                <div className="flex items-center gap-2">
                  {icon && <span>{icon}</span>}
                  {label}
                </div>
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )}
      </div>
    );
  },
);

FormToggle.displayName = "FormToggle";
