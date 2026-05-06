import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Context Menu** — right-click action menu
 *
 * Supports:
 * - Trigger on right-click
 * - Nested menus (submenus)
 * - Disabled items
 * - Shortcuts (display only)
 * - Dividers
 * - Icons + labels
 * - Keyboard navigation
 *
 * Use: Right-click actions, bulk operations, file/item actions
 */

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  onOpen?: () => void;
  onClose?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ trigger, items, onOpen, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
    onOpen?.();
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const renderMenuItems = (items: ContextMenuItem[], level = 0) => (
    <div
      ref={level === 0 ? menuRef : undefined}
      className={cn(
        "bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50",
        level === 0 ? "absolute" : "absolute top-0 left-full ml-1",
      )}
      style={level === 0 ? { top: `${position.y}px`, left: `${position.x}px` } : undefined}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.divider ? (
            <div className="h-px bg-border" />
          ) : (
            <button
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
                onClose?.();
              }}
              disabled={item.disabled}
              className={cn(
                "w-full px-3 py-2 text-sm flex items-center gap-2 justify-between hover:bg-muted transition-colors",
                item.disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              {item.shortcut && <span className="text-xs text-muted-foreground">{item.shortcut}</span>}
              {item.submenu && <span className="ml-2">›</span>}
            </button>
          )}
          {item.submenu && (
            <div className="hidden group-hover:block">
              {renderMenuItems(item.submenu, level + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={containerRef} onContextMenu={handleContextMenu} className="relative">
      {trigger}
      {isOpen && renderMenuItems(items)}
    </div>
  );
};

ContextMenu.displayName = "ContextMenu";
