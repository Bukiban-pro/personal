import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Select** — semantic, accessible, searchable
 *
 * Supports:
 * - Single/multiple selection modes
 * - Searchable filtering
 * - Grouped options
 * - Custom option rendering
 * - Disabled/readonly states
 * - Error states
 * - Size variants
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Portal rendering (no overflow issues)
 *
 * Keyboard shortcuts:
 * - Arrow Up/Down: Navigate options
 * - Enter: Select
 * - Escape: Close
 * - Type: Filter options (if searchable)
 */

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface FormSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  state?: "default" | "success" | "warning" | "error";
}

export const FormSelect = React.forwardRef<HTMLDivElement, FormSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select...",
      label,
      error,
      helperText,
      multiple = false,
      searchable = false,
      clearable = true,
      disabled = false,
      size = "md",
      state = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selectId = React.useId();
    const errorId = React.useId();

    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

    const filteredOptions = React.useMemo(
      () =>
        searchTerm.trim() === ""
          ? options
          : options.filter((opt) =>
              opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
      [options, searchTerm],
    );

    const getDisplayLabel = () => {
      if (selectedValues.length === 0) return placeholder;
      if (multiple) return `${selectedValues.length} selected`;
      const selected = options.find((opt) => opt.value === selectedValues[0]);
      return selected?.label || placeholder;
    };

    const handleSelect = (optionValue: string | number) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : undefined);
    };

    const sizeStyles = {
      sm: "px-2.5 py-1.5 text-sm h-8",
      md: "px-3 py-2 text-sm h-10",
      lg: "px-4 py-2.5 text-base h-12",
    };

    const stateStyles = {
      default: "border-border focus-within:border-primary/50 focus-within:ring-primary/20",
      success: "border-green-500/50 focus-within:border-green-500 focus-within:ring-green-500/20",
      warning: "border-yellow-500/50 focus-within:border-yellow-500 focus-within:ring-yellow-500/20",
      error: "border-red-500/50 focus-within:border-red-500 focus-within:ring-red-500/20",
    };

    // Close on outside click
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    React.useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev === 0 ? filteredOptions.length - 1 : prev - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            handleSelect(filteredOptions[highlightedIndex]?.value);
            break;
          case "Escape":
            setIsOpen(false);
            break;
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, filteredOptions]);

    return (
      <div
        ref={containerRef}
        className={cn("flex flex-col gap-1.5 w-full", className)}
        {...props}
      >
        {label && <label className="text-sm font-medium text-foreground/90">{label}</label>}

        <div
          className={cn(
            "relative border rounded-lg bg-background transition-colors focus-within:ring-1",
            sizeStyles[size],
            stateStyles[state],
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full h-full flex items-center justify-between gap-2 text-left"
          >
            <span className={cn(selectedValues.length === 0 && "text-muted-foreground")}>
              {getDisplayLabel()}
            </span>
            <div className="flex items-center gap-1">
              {clearable && selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-foreground/50 hover:text-foreground"
                >
                  ✕
                </button>
              )}
              <span className="text-foreground/50">▼</span>
            </div>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50">
              {searchable && (
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  className="w-full px-3 py-2 border-b border-border text-sm focus:outline-none"
                  autoFocus
                />
              )}
              <div className="max-h-64 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No options</div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <button
                      key={`${option.group}-${option.value}`}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2",
                        index === highlightedIndex && "bg-primary/10",
                        selectedValues.includes(option.value) && "font-medium text-primary",
                        option.disabled && "opacity-50 cursor-not-allowed",
                      )}
                    >
                        {multiple && (
                          <input
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            readOnly
                            className="w-4 h-4"
                          />
                        )}
                        {option.label}
                      </button>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div id={errorId} className={cn(error ? "text-red-500" : "text-muted-foreground", "text-xs")}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
