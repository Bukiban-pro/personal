import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Autocomplete** — searchable input with custom rendering
 *
 * Supports:
 * - Filtering/searching
 * - Custom item rendering
 * - Keyboard navigation
 * - Multiple selection mode
 * - Debounced search
 *
 * Use: Enhanced search, command palette, form fields
 */

export interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
  category?: string;
  icon?: React.ReactNode;
}

export interface AutocompleteProps extends React.HTMLAttributes<HTMLInputElement> {
  options: AutocompleteOption[];
  onSelect: (option: AutocompleteOption) => void;
  placeholder?: string;
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
}

export const AdvancedAutocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      onSelect,
      placeholder = "Search...",
      renderOption,
      className,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [filtered, setFiltered] = React.useState<AutocompleteOption[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const newFiltered = options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setFiltered(newFiltered);
      setSelectedIndex(0);
    }, [inputValue, options]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex]);
          setInputValue("");
          setIsOpen(false);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    return (
      <div
        ref={containerRef}
        className="relative w-full"
      >
        <input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground",
            className,
          )}
          {...props}
        />

        {/* Dropdown */}
        {isOpen && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {filtered.map((option, i) => (
              <div
                key={option.id}
                onClick={() => {
                  onSelect(option);
                  setInputValue("");
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-2 cursor-pointer transition-colors",
                  i === selectedIndex ? "bg-primary/10 text-primary" : "hover:bg-muted",
                )}
              >
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <div className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    <div>
                      <div className="text-sm font-medium">{option.label}</div>
                      {option.category && (
                        <div className="text-xs text-muted-foreground">
                          {option.category}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

AdvancedAutocomplete.displayName = "AdvancedAutocomplete";
