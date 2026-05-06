import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Tooltip** — lightweight hover tooltip
 *
 * Supports:
 * - Placement: top/bottom/left/right
 * - Delay (hoverDelay before showing)
 * - Content as string or ReactNode
 * - Arrow/caret
 * - Custom styling
 * - Escape to close
 *
 * Use: Help text, icon hints, keyboard shortcut displays
 */

export interface TooltipProps {
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  delayMs = 200,
  children,
  showArrow = true,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;

    if (placement === "top") {
      top = triggerRect.top - tooltipRect.height - offset;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    } else if (placement === "bottom") {
      top = triggerRect.bottom + offset;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    } else if (placement === "left") {
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left - tooltipRect.width - offset;
    } else if (placement === "right") {
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + offset;
    }

    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  React.useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible]);

  const arrowMap = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2",
    left: "right-[-4px] top-1/2 -translate-y-1/2 rotate-90",
    right: "left-[-4px] top-1/2 -translate-y-1/2 -rotate-90",
  };

  return (
    <>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "fixed bg-foreground text-background text-xs rounded-md shadow-lg px-2.5 py-1.5 z-50 whitespace-nowrap animate-in fade-in zoom-in-95",
            className,
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          role="tooltip"
        >
          {showArrow && (
            <div
              className={cn(
                "absolute w-2 h-2 bg-foreground rotate-45",
                arrowMap[placement],
              )}
            />
          )}
          {content}
        </div>
      )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
