import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Radio Group** — semantic, accessible, flexible
 *
 * Supports:
 * - Single selection from options
 * - Disabled individual items or entire group
 * - Error states
 * - Size variants
 * - Horizontal/vertical layout
 * - Description text per option
 * - Icon/badge support
 *
 * Use with `react-hook-form` via `{...register()}` or controlled.
 */

export interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface FormRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  options: RadioOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
  direction?: "horizontal" | "vertical";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  state?: "default" | "success" | "warning" | "error";
}

export const FormRadioGroup = React.forwardRef<HTMLDivElement, FormRadioGroupProps>(
  (
    {
      options,
      value,
      onChange,
      name,
      label,
      error,
      helperText,
      direction = "vertical",
      disabled = false,
      size = "md",
      state = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const groupId = React.useId();
    const errorId = React.useId();

    const sizeStyles = {
      sm: { radio: "h-4 w-4", label: "text-sm" },
      md: { radio: "h-5 w-5", label: "text-sm" },
      lg: { radio: "h-6 w-6", label: "text-base" },
    };

    const stateStyles = {
      default: "accent-primary",
      success: "accent-green-500",
      warning: "accent-yellow-500",
      error: "accent-red-500",
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2.5 w-full", className)} {...props}>
        {label && (
          <label htmlFor={groupId} className="text-sm font-medium text-foreground/90">
            {label}
          </label>
        )}

        <fieldset
          id={groupId}
          className={cn(
            "flex gap-3",
            direction === "vertical" ? "flex-col" : "flex-row flex-wrap",
          )}
          disabled={disabled}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-2",
                disabled || option.disabled ? "opacity-50 cursor-not-allowed" : "",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                id={`${groupId}-${option.value}`}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled || option.disabled}
                className={cn(
                  "rounded-full border border-border mt-1",
                  sizeStyles[size].radio,
                  stateStyles[state],
                )}
                aria-describedby={error ? errorId : helperText ? errorId : undefined}
              />
              <label
                htmlFor={`${groupId}-${option.value}`}
                className={cn(
                  "leading-relaxed cursor-pointer flex items-center gap-2",
                  sizeStyles[size].label,
                  disabled || option.disabled ? "cursor-not-allowed" : "",
                )}
              >
                {option.icon && <span>{option.icon}</span>}
                <div>
                  <div className="font-medium text-foreground">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  )}
                </div>
              </label>
            </div>
          ))}
        </fieldset>

        {(error || helperText) && (
          <div id={errorId} className={cn(error ? "text-red-500" : "text-muted-foreground", "text-xs")}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

FormRadioGroup.displayName = "FormRadioGroup";
