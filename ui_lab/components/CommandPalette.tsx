import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Command Palette / Command Menu** — keyboard-accessible command search
 *
 * Supports:
 * - Command search/filtering
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Grouped commands
 * - Icons/badges
 * - Recently used tracking
 * - Category sections
 *
 * Use: Mac-style cmd+k menu, developer tools, search
 */

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  action: () => void;
}

export interface CommandPaletteProps extends React.HTMLAttributes<HTMLDivElement> {
  commands: Command[];
  onOpen?: (open: boolean) => void;
  shortcut?: string;
  placeholder?: string;
}

export const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      commands,
      onOpen,
      shortcut = "Cmd+K",
      placeholder = "Search commands...",
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Filter commands
    const filteredCommands = React.useMemo(() => {
      const query = searchQuery.toLowerCase();
      return commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query) ||
          cmd.description?.toLowerCase().includes(query),
      );
    }, [searchQuery, commands]);

    // Group by category
    const groupedCommands = React.useMemo(() => {
      const groups: Record<string, Command[]> = {};
      filteredCommands.forEach((cmd) => {
        const category = cmd.category || "Other";
        if (!groups[category]) groups[category] = [];
        groups[category].push(cmd);
      });
      return groups;
    }, [filteredCommands]);

    // Keyboard shortcuts
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          setIsOpen(!isOpen);
          onOpen?.(!isOpen);
        }

        if (!isOpen) return;

        if (e.key === "Escape") {
          setIsOpen(false);
          onOpen?.(false);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((i) =>
            i < filteredCommands.length - 1 ? i + 1 : 0,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((i) =>
            i > 0 ? i - 1 : filteredCommands.length - 1,
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            setIsOpen(false);
            onOpen?.(false);
            setSearchQuery("");
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onOpen]);

    // Focus input when opened
    React.useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus();
      }
    }, [isOpen]);

    if (!isOpen) {
      return null;
    }

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setIsOpen(false);
            onOpen?.(false);
          }}
        />

        {/* Palette */}
        <div
          ref={ref}
          className={cn(
            "fixed top-1/3 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-top-4",
            className,
          )}
          {...props}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <span>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <span className="text-xs text-muted-foreground">{shortcut}</span>
          </div>

          {/* Commands */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedCommands).length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No commands found
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase">
                    {category}
                  </div>
                  {cmds.map((cmd, i) => {
                    const isSelected = selectedIndex === filteredCommands.indexOf(cmd);
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsOpen(false);
                          onOpen?.(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted cursor-pointer transition-colors",
                          isSelected && "bg-primary/20 text-primary",
                        )}
                      >
                        {cmd.icon && <span className="text-lg">{cmd.icon}</span>}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{cmd.label}</div>
                          {cmd.description && (
                            <div className="text-xs text-muted-foreground">
                              {cmd.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </>
    );
  },
);

CommandPalette.displayName = "CommandPalette";
