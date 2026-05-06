import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Input** — semantic, accessible, error-aware
 *
 * Supports:
 * - Multiple input types (text, email, password, number, tel, url)
 * - Label + error + helper text layout
 * - Placeholder + floating label option
 * - Icon decorators (leading/trailing)
 * - Disabled/readonly states
 * - Success/warning/error states
 * - Size variants (sm/md/lg)
 * - Character counter
 *
 * Use with `react-hook-form` via `{...register()}` or controlled via `value/onChange`.
 */

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  state?: "default" | "success" | "warning" | "error";
  floatingLabel?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      size = "md",
      state = "default",
      floatingLabel = false,
      maxLength,
      showCharCount = false,
      containerClassName,
      className,
      disabled,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = React.useState(0);
    const inputId = React.useId();
    const errorId = React.useId();

    const stateStyles = {
      default: "border-border focus:border-primary/50 focus:ring-primary/20",
      success: "border-green-500/50 focus:border-green-500 focus:ring-green-500/20",
      warning: "border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500/20",
      error: "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
    };

    const sizeStyles = {
      sm: "px-2.5 py-1.5 text-sm h-8",
      md: "px-3 py-2 text-sm h-10",
      lg: "px-4 py-2.5 text-base h-12",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground/90"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-2.5 text-foreground/50 pointer-events-none">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={state === "error"}
            aria-describedby={error ? errorId : helperText ? errorId : undefined}
            className={cn(
              "w-full bg-background border rounded-lg transition-colors focus:outline-none focus:ring-1",
              sizeStyles[size],
              leadingIcon && "pl-8",
              trailingIcon && "pr-8",
              stateStyles[state],
              disabled && "opacity-50 cursor-not-allowed bg-muted",
              className,
            )}
            placeholder={floatingLabel ? undefined : props.placeholder}
            onChange={handleChange}
            {...props}
          />

          {floatingLabel && label && (
            <label
              htmlFor={inputId}
              className="absolute left-3 top-2.5 text-sm font-medium text-foreground/90 pointer-events-none"
            >
              {label}
            </label>
          )}

          {trailingIcon && (
            <div className="absolute right-2.5 text-foreground/50 pointer-events-none">
              {trailingIcon}
            </div>
          )}
        </div>

        {(error || helperText || showCharCount) && (
          <div className="flex items-center justify-between text-xs">
            <div id={errorId} className={cn(error ? "text-red-500" : "text-muted-foreground")}>
              {error || helperText}
            </div>
            {showCharCount && maxLength && (
              <span className="text-muted-foreground">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
