import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Textarea** — multi-line text input
 *
 * Supports:
 * - Auto-resizing (grows as you type)
 * - Fixed/min/max rows
 * - Placeholder + label
 * - Character counter
 * - Word counter
 * - Error states
 * - Size variants
 * - Max length validation
 * - RTL support ready
 *
 * Use with `react-hook-form` via `{...register()}` or controlled.
 */

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCharCount?: boolean;
  showWordCount?: boolean;
  size?: "sm" | "md" | "lg";
  state?: "default" | "success" | "warning" | "error";
  containerClassName?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      showCharCount = false,
      showWordCount = false,
      size = "md",
      state = "default",
      containerClassName,
      className,
      disabled,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = React.useState(0);
    const [wordCount, setWordCount] = React.useState(0);
    const [height, setHeight] = React.useState("auto");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaId = React.useId();
    const errorId = React.useId();

    const stateStyles = {
      default: "border-border focus:border-primary/50 focus:ring-primary/20",
      success: "border-green-500/50 focus:border-green-500 focus:ring-green-500/20",
      warning: "border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500/20",
      error: "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
    };

    const sizeStyles = {
      sm: "px-2.5 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-2.5 text-base",
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).filter((w) => w.length > 0).length);

      if (autoResize && textareaRef.current) {
        setHeight("auto");
        const scrollHeight = textareaRef.current.scrollHeight;
        setHeight(`${Math.min(scrollHeight, minRows * 24 + (maxRows - minRows) * 24)}px`);
      }

      props.onChange?.(e);
    };

    React.useImperativeHandle(ref, () => textareaRef.current!);

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-foreground/90">
            {label}
          </label>
        )}

        <textarea
          ref={textareaRef}
          id={textareaId}
          disabled={disabled}
          rows={autoResize ? minRows : minRows}
          maxLength={maxLength}
          aria-invalid={state === "error"}
          aria-describedby={error ? errorId : helperText ? errorId : undefined}
          className={cn(
            "w-full bg-background border rounded-lg transition-colors focus:outline-none focus:ring-1 resize-none",
            sizeStyles[size],
            stateStyles[state],
            disabled && "opacity-50 cursor-not-allowed bg-muted",
            autoResize && "overflow-hidden",
            className,
          )}
          style={autoResize ? { height } : undefined}
          onChange={handleChange}
          maxRows={maxRows}
          {...props}
        />

        {(error || helperText || showCharCount || showWordCount) && (
          <div className="flex items-center justify-between text-xs">
            <div id={errorId} className={cn(error ? "text-red-500" : "text-muted-foreground")}>
              {error || helperText}
            </div>
            {(showCharCount || showWordCount) && (
              <div className="text-muted-foreground">
                {showCharCount && maxLength && <span>{charCount}/{maxLength}</span>}
                {showCharCount && showWordCount && <span> • </span>}
                {showWordCount && <span>{wordCount} words</span>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
