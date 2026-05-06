import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Tabs** — multiple tab style variants
 *
 * Supports:
 * - Tab styles: default/pills/underline/vertical
 * - Controlled/uncontrolled modes
 * - Disabled tabs
 * - Icon support
 * - Badge support (e.g., notification count)
 * - Lazy loading content
 * - Keyboard navigation (Arrow keys, Home, End)
 *
 * Use: Multi-section layouts, settings, documentation, navigation
 */

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface AdvancedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "default" | "pills" | "underline" | "vertical";
  size?: "sm" | "md" | "lg";
  lazy?: boolean;
  fullWidth?: boolean;
}

export const AdvancedTabs = React.forwardRef<HTMLDivElement, AdvancedTabsProps>(
  (
    {
      tabs,
      value,
      onValueChange,
      variant = "default",
      size = "md",
      lazy = false,
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [activeTab, setActiveTab] = React.useState(value || tabs[0]?.value);
    const [renderedTabs, setRenderedTabs] = React.useState(new Set([activeTab]));

    React.useEffect(() => {
      if (value) setActiveTab(value);
    }, [value]);

    React.useEffect(() => {
      if (lazy) {
        setRenderedTabs((prev) => new Set([...prev, activeTab]));
      }
    }, [activeTab, lazy]);

    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
      let nextIndex = currentIndex;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = tabs.length - 1;
      }

      const nextTab = tabs[nextIndex];
      if (!nextTab?.disabled) {
        setActiveTab(nextTab.value);
        onValueChange?.(nextTab.value);
      }
    };

    const sizeMap = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-3 py-2",
      lg: "text-base px-4 py-2.5",
    };

    const tabContainerClass = {
      default: "flex gap-1 border-b",
      pills: "flex gap-2",
      underline: "flex gap-4 border-b",
      vertical: "flex flex-col gap-1 w-48",
    };

    const tabButtonClass = (isActive: boolean) => {
      const base = "relative font-medium transition-colors rounded-lg";
      if (variant === "default") {
        return cn(
          base,
          "px-4 py-2.5",
          isActive ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground",
        );
      } else if (variant === "pills") {
        return cn(
          base,
          "px-3 py-1.5 rounded-full",
          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80",
        );
      } else if (variant === "underline") {
        return cn(
          base,
          "px-0 pb-2",
          isActive
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground border-b-2 border-transparent",
        );
      } else if (variant === "vertical") {
        return cn(
          base,
          "w-full text-left px-3 py-2",
          isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-muted",
        );
      }
      return base;
    };

    return (
      <div ref={ref} className={cn("flex gap-4", variant === "vertical" ? "flex-row" : "flex-col", className)} {...props}>
        <div className={cn("flex", tabContainerClass[variant], fullWidth && "w-full")}>
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                onValueChange?.(tab.value);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={tab.disabled}
              className={cn(
                sizeMap[size],
                tabButtonClass(activeTab === tab.value),
                tab.disabled && "opacity-50 cursor-not-allowed",
              )}
              role="tab"
              aria-selected={activeTab === tab.value}
              aria-disabled={tab.disabled}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1">
          {tabs.map((tab) => (
            (!lazy || renderedTabs.has(tab.value)) && (
              <div
                key={tab.value}
                hidden={activeTab !== tab.value}
                className={cn("animate-in fade-in", activeTab === tab.value ? "block" : "hidden")}
                role="tabpanel"
              >
                {children ? children({ tab, isActive: activeTab === tab.value }) : tab.content}
              </div>
            )
          ))}
        </div>
      </div>
    );
  },
);

AdvancedTabs.displayName = "AdvancedTabs";
