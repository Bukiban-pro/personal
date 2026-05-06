import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Long Press / Hold Detector** — detect long-press/hold gesture
 *
 * Supports:
 * - Configurable duration
 * - Visual feedback during hold
 * - Cancel on mouse leave
 * - Progress indicator
 *
 * Use: Context menus, special actions, mobile interactions
 */

export interface LongPressProps extends React.HTMLAttributes<HTMLDivElement> {
  onLongPress: () => void;
  duration?: number;
  children: React.ReactNode;
  showProgress?: boolean;
}

export const LongPress = React.forwardRef<HTMLDivElement, LongPressProps>(
  (
    {
      onLongPress,
      duration = 1000,
      children,
      showProgress = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [isHolding, setIsHolding] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const timeoutRef = React.useRef<NodeJS.Timeout>();
    const rafRef = React.useRef<number>();
    const startTimeRef = React.useRef<number>();

    const updateProgress = () => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        onLongPress();
        setIsHolding(false);
        setProgress(0);
      } else {
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    const handleMouseDown = () => {
      setIsHolding(true);
      startTimeRef.current = Date.now();
      setProgress(0);
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    const handleMouseUp = () => {
      setIsHolding(false);
      setProgress(0);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    const handleMouseLeave = () => {
      handleMouseUp();
    };

    return (
      <div
        ref={ref}
        className={cn("relative select-none", className)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        {...props}
      >
        {children}

        {showProgress && isHolding && (
          <div
            className="absolute inset-0 bg-primary/20 rounded-lg transition-all"
            style={{
              clipPath: `inset(0 ${100 - progress}% 0 0)`,
            }}
          />
        )}
      </div>
    );
  },
);

LongPress.displayName = "LongPress";
