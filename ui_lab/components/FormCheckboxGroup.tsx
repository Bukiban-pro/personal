import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Checkbox Group** — semantic, accessible, flexible layout
 *
 * Supports:
 * - Single/multiple checkboxes or checkbox groups
 * - Custom label rendering
 * - Indeterminate state (partial selection in groups)
 * - Disabled individual items or entire group
 * - Error states
 * - Size variants
 * - Horizontal/vertical layout
 * - Description text per checkbox
 *
 * Use with `react-hook-form` via Controller for arrays or direct binding.
 */

export interface CheckboxOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface FormCheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  options: CheckboxOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  label?: string;
  error?: string;
  helperText?: string;
  direction?: "horizontal" | "vertical";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  state?: "default" | "success" | "warning" | "error";
}

export const FormCheckboxGroup = React.forwardRef<HTMLDivElement, FormCheckboxGroupProps>(
  (
    {
      options,
      value = [],
      onChange,
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

    const handleChange = (optionValue: string | number, checked: boolean) => {
      if (checked) {
        onChange?.([...value, optionValue]);
      } else {
        onChange?.(value.filter((v) => v !== optionValue));
      }
    };

    const sizeStyles = {
      sm: { checkbox: "h-4 w-4", label: "text-sm" },
      md: { checkbox: "h-5 w-5", label: "text-sm" },
      lg: { checkbox: "h-6 w-6", label: "text-base" },
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
                type="checkbox"
                id={`${groupId}-${option.value}`}
                checked={value.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                disabled={disabled || option.disabled}
                className={cn(
                  "rounded border border-border mt-1",
                  sizeStyles[size].checkbox,
                  stateStyles[state],
                )}
                aria-describedby={error ? errorId : helperText ? errorId : undefined}
              />
              <label
                htmlFor={`${groupId}-${option.value}`}
                className={cn(
                  "leading-relaxed cursor-pointer",
                  sizeStyles[size].label,
                  disabled || option.disabled ? "cursor-not-allowed" : "",
                )}
              >
                <div className="font-medium text-foreground">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                )}
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

FormCheckboxGroup.displayName = "FormCheckboxGroup";

// ─── Single Checkbox variant ──────────────────────────────────────────────

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, description, error, className, ...props }, ref) => {
    const id = React.useId();
    return (
      <div className={cn("flex items-start gap-2", className)}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className="h-5 w-5 rounded border border-border accent-primary mt-0.5"
          {...props}
        />
        <label htmlFor={id} className="leading-relaxed cursor-pointer">
          {label && <div className="font-medium text-foreground">{label}</div>}
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
          {error && <div className="text-xs text-red-500">{error}</div>}
        </label>
      </div>
    );
  },
);

FormCheckbox.displayName = "FormCheckbox";
