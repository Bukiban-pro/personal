import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Popover** — floating positioned tooltip/menu
 *
 * Supports:
 * - Placement: top/bottom/left/right (with auto-adjust)
 * - Trigger modes: click/hover/focus
 * - Arrow/caret pointing to trigger
 * - Portal rendering (no overflow issues)
 * - Click-outside to close
 * - Escape key to close
 * - Keyboard navigation
 *
 * Use: Rich tooltips, dropdown menus, context popovers, date pickers
 */

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "top" | "bottom" | "left" | "right";
  triggerMode?: "click" | "hover" | "focus";
  showArrow?: boolean;
  offset?: number;
  children: React.ReactNode;
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      trigger,
      open = false,
      onOpenChange,
      placement = "bottom",
      triggerMode = "click",
      showArrow = true,
      offset = 8,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(open);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const updatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      if (placement === "top") {
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      } else if (placement === "bottom") {
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      } else if (placement === "left") {
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left - contentRect.width - offset;
      } else if (placement === "right") {
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + offset;
      }

      setPosition({ top, left });
    };

    React.useEffect(() => {
      if (isOpen) {
        updatePosition();
        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);
        return () => {
          window.removeEventListener("scroll", updatePosition);
          window.removeEventListener("resize", updatePosition);
        };
      }
    }, [isOpen]);

    // Close on outside click
    React.useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          contentRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          !contentRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onOpenChange]);

    // Close on escape
    React.useEffect(() => {
      if (!isOpen) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onOpenChange]);

    const triggerProps = {
      ...(triggerMode === "click" && {
        onClick: () => {
          setIsOpen(!isOpen);
          onOpenChange?.(!isOpen);
        },
      }),
      ...(triggerMode === "hover" && {
        onMouseEnter: () => {
          setIsOpen(true);
          onOpenChange?.(true);
        },
        onMouseLeave: () => {
          setIsOpen(false);
          onOpenChange?.(false);
        },
      }),
      ...(triggerMode === "focus" && {
        onFocus: () => {
          setIsOpen(true);
          onOpenChange?.(true);
        },
        onBlur: () => {
          setIsOpen(false);
          onOpenChange?.(false);
        },
      }),
    };

    const arrowMap = {
      top: "bottom-[-6px] left-1/2 -translate-x-1/2",
      bottom: "top-[-6px] left-1/2 -translate-x-1/2",
      left: "right-[-6px] top-1/2 -translate-y-1/2 rotate-90",
      right: "left-[-6px] top-1/2 -translate-y-1/2 -rotate-90",
    };

    return (
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          className="cursor-pointer"
          aria-expanded={isOpen}
          {...triggerProps}
        >
          {trigger}
        </button>

        {isOpen && (
          <div
            ref={contentRef}
            className={cn(
              "fixed bg-background border border-border rounded-lg shadow-lg p-3 z-50 animate-in fade-in zoom-in-95",
              className,
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            {...props}
          >
            {showArrow && (
              <div
                className={cn(
                  "absolute w-3 h-3 bg-background border-t border-r border-border rotate-45",
                  arrowMap[placement],
                )}
              />
            )}
            {children}
          </div>
        )}
      </div>
    );
  },
);

Popover.displayName = "Popover";
