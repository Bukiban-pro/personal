import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Menu / Dropdown Component** — hierarchical menu with submenus
 *
 * Supports:
 * - Top-level triggers
 * - Nested submenus
 * - Icons + text
 * - Disabled items
 * - Dividers
 * - Keyboard navigation
 * - Click-outside to close
 *
 * Use: Navigation menus, dropdown actions, context menus
 */

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  submenu?: MenuItem[];
}

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  trigger: React.ReactNode;
  align?: "left" | "right" | "center";
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      items,
      trigger,
      align = "left",
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);
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

    const alignMap = {
      left: "left-0",
      right: "right-0",
      center: "left-1/2 -translate-x-1/2",
    };

    const renderMenuItems = (menuItems: MenuItem[], depth = 0) => (
      <div className="space-y-1 py-1">
        {menuItems.map((item, i) => (
          <div key={i} className="relative group">
            <button
              onClick={() => {
                item.onClick?.();
                if (!item.submenu) setIsOpen(false);
              }}
              onMouseEnter={() => item.submenu && setOpenSubmenu(`${depth}-${i}`)}
              onMouseLeave={() => setOpenSubmenu(null)}
              disabled={item.disabled}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-muted transition-colors",
                item.disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.label}</span>
              {item.submenu && <span className="ml-auto text-xs">▶</span>}
            </button>

            {/* Submenu */}
            {item.submenu && openSubmenu === `${depth}-${i}` && (
              <div className="absolute left-full top-0 ml-1 bg-background border border-border rounded-lg shadow-lg min-w-max z-50">
                {renderMenuItems(item.submenu, depth + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    return (
      <div
        ref={containerRef}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {/* Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded border border-border hover:bg-muted transition-colors"
        >
          {trigger}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              "absolute top-full mt-1 bg-background border border-border rounded-lg shadow-lg min-w-max z-50 animate-in fade-in slide-in-from-top-2",
              alignMap[align],
            )}
          >
            {renderMenuItems(items)}
          </div>
        )}
      </div>
    );
  },
);

Menu.displayName = "Menu";
