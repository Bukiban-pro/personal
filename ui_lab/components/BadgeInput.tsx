import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Badge/Chip Input** — input that converts values to removable badges/chips
 *
 * Supports:
 * - Add multiple values as chips
 * - Remove individual chips
 * - Clear all
 * - Validation
 * - Keyboard shortcuts (Enter to add, Backspace to remove)
 * - Autocomplete integration
 *
 * Use: Tags, email lists, keyword input, user mentions
 */

export interface BadgeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  values: string[];
  onChange?: (values: string[]) => void;
  onInputChange?: (value: string) => void;
  suggestions?: string[];
  max?: number;
  duplicatePrevention?: boolean;
}

export const BadgeInput = React.forwardRef<HTMLInputElement, BadgeInputProps>(
  (
    {
      values,
      onChange,
      onInputChange,
      suggestions = [],
      max,
      duplicatePrevention = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const handleAddValue = (value: string) => {
      const trimmed = value.trim();

      if (!trimmed || (max && values.length >= max)) return;
      if (duplicatePrevention && values.includes(trimmed)) return;

      onChange?.([...values, trimmed]);
      setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddValue(inputValue);
      } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
        onChange?.(values.slice(0, -1));
      }
    };

    const handleRemove = (index: number) => {
      onChange?.(values.filter((_, i) => i !== index));
    };

    const filteredSuggestions = suggestions.filter(
      (s) =>
        s.toLowerCase().includes(inputValue.toLowerCase()) &&
        !values.includes(s),
    );

    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2 p-2 min-h-10 bg-background border border-border rounded-lg focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/50">
          {values.map((value, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              <span>{value}</span>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="hover:text-primary/70"
              >
                ✕
              </button>
            </div>
          ))}

          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              onInputChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={values.length === 0 ? "Add values..." : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
            disabled={max && values.length >= max}
            {...props}
          />
        </div>

        {/* Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="mt-1 p-2 bg-background border border-border rounded-lg shadow-md">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddValue(suggestion)}
                className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

BadgeInput.displayName = "BadgeInput";
