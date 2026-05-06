import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Mega Menu** — large multi-column dropdown menu
 *
 * Supports:
 * - Multiple columns of links
 * - Sections/categories
 * - Featured items
 * - Icons + descriptions
 * - Nested structure
 *
 * Use: Product navigation, complex site menus
 */

export interface MegaMenuComponentItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  description?: string;
  featured?: boolean;
  submenu?: MegaMenuComponentItem[];
}

export interface MegaMenuComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: Array<{
    title: string;
    items: MegaMenuComponentItem[];
  }>;
  columns?: number;
}

export const MegaMenuComponent = React.forwardRef<HTMLDivElement, MegaMenuComponentProps>(
  (
    {
      trigger,
      items,
      columns = 3,
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {/* Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          {trigger}
        </button>

        {/* Mega Menu */}
        {isOpen && (
          <div
            ref={ref}
            className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-xl p-6 z-50 animate-in fade-in slide-in-from-top-2"
            style={{
              width: `${columns * 250}px`,
            }}
          >
            <div className={cn("grid gap-6", `grid-cols-${columns}`)}>
              {items.map((section, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-foreground mb-3">{section.title}</h4>
                  <div className="space-y-2">
                    {section.items.map((item, j) => (
                      <a
                        key={j}
                        href={item.href}
                        className={cn(
                          "flex gap-2 p-2 rounded hover:bg-muted transition-colors",
                          item.featured && "bg-muted/50 border border-primary/20",
                        )}
                      >
                        {item.icon && <span className="text-lg flex-shrink-0">{item.icon}</span>}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

MegaMenuComponent.displayName = "MegaMenuComponent";
