import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Slider** — range input with visual track + labels
 *
 * Supports:
 * - Single/range (dual-thumb) slider
 * - Min/max bounds + step control
 * - Value labels (current + min/max range)
 * - Tooltip on hover
 * - Disabled state
 * - Size variants
 * - Error states
 * - Color variants (primary/secondary/success/warning/error)
 *
 * Use with `react-hook-form` via controlled or register.
 */

export interface FormSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  error?: string;
  helperText?: string;
  showValue?: boolean;
  showRange?: boolean;
  range?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
}

export const FormSlider = React.forwardRef<HTMLDivElement, FormSliderProps>(
  (
    {
      value = 50,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      label,
      error,
      helperText,
      showValue = true,
      showRange = true,
      range = false,
      disabled = false,
      size = "md",
      variant = "primary",
      className,
      ...props
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = React.useState(value);
    const [isDragging, setIsDragging] = React.useState(false);
    const sliderId = React.useId();
    const errorId = React.useId();

    const sliderValue = Array.isArray(localValue) ? localValue : [localValue];
    const sliderMin = Array.isArray(localValue) ? localValue[0] : localValue;
    const sliderMax = Array.isArray(localValue) ? localValue[1] : localValue;

    const trackPercentMin = ((sliderMin - min) / (max - min)) * 100;
    const trackPercentMax = ((sliderMax - min) / (max - min)) * 100;

    const handleChange = (newValue: number | [number, number]) => {
      setLocalValue(newValue);
      onChange?.(newValue);
    };

    const sizeStyles = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    const thumbSizeStyles = {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    const variantStyles = {
      primary: "bg-primary accent-primary",
      secondary: "bg-secondary accent-secondary",
      success: "bg-green-500 accent-green-500",
      warning: "bg-yellow-500 accent-yellow-500",
      error: "bg-red-500 accent-red-500",
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2.5 w-full", className)} {...props}>
        {label && (
          <label htmlFor={sliderId} className="text-sm font-medium text-foreground/90">
            {label}
          </label>
        )}

        <div className="flex items-center justify-between gap-4">
          {showRange && (
            <div className="text-xs text-muted-foreground">
              {min}
            </div>
          )}

          <div className="flex-1">
            {range ? (
              // Range slider (dual thumb)
              <div className="relative h-full flex items-center">
                <div className={cn("absolute w-full rounded-full bg-muted", sizeStyles[size])} />
                <div
                  className={cn(
                    "absolute rounded-full",
                    sizeStyles[size],
                    variantStyles[variant],
                  )}
                  style={{
                    left: `${trackPercentMin}%`,
                    right: `${100 - trackPercentMax}%`,
                  }}
                />
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={sliderMin}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= sliderMax) {
                      handleChange([newMin, sliderMax]);
                    }
                  }}
                  disabled={disabled}
                  className={cn(
                    "absolute w-full h-full appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer",
                    "[&::-webkit-slider-thumb]:" + thumbSizeStyles[size],
                    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2",
                    "[&::-webkit-slider-thumb]:border-primary",
                    "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer",
                  )}
                />
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={sliderMax}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= sliderMin) {
                      handleChange([sliderMin, newMax]);
                    }
                  }}
                  disabled={disabled}
                  className={cn(
                    "absolute w-full h-full appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer",
                    "[&::-webkit-slider-thumb]:" + thumbSizeStyles[size],
                    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2",
                    "[&::-webkit-slider-thumb]:border-primary",
                    "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer",
                  )}
                />
              </div>
            ) : (
              // Single slider
              <div className="relative h-full flex items-center">
                <div className={cn("absolute w-full rounded-full bg-muted", sizeStyles[size])} />
                <div
                  className={cn(
                    "absolute rounded-full",
                    sizeStyles[size],
                    variantStyles[variant],
                  )}
                  style={{
                    width: `${trackPercentMin}%`,
                  }}
                />
                <input
                  id={sliderId}
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={sliderMin}
                  onChange={(e) => handleChange(parseInt(e.target.value))}
                  disabled={disabled}
                  className={cn(
                    "relative w-full appearance-none bg-transparent cursor-pointer",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer",
                    "[&::-webkit-slider-thumb]:" + thumbSizeStyles[size],
                    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2",
                    "[&::-webkit-slider-thumb]:border-primary",
                    "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed",
                  )}
                  aria-describedby={error ? errorId : helperText ? errorId : undefined}
                />
              </div>
            )}
          </div>

          {showRange && (
            <div className="text-xs text-muted-foreground">
              {max}
            </div>
          )}
        </div>

        {showValue && (
          <div className="text-sm font-medium text-foreground">
            {range ? `${sliderMin} - ${sliderMax}` : sliderMin}
          </div>
        )}

        {(error || helperText) && (
          <div id={errorId} className={cn(error ? "text-red-500" : "text-muted-foreground", "text-xs")}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

FormSlider.displayName = "FormSlider";
