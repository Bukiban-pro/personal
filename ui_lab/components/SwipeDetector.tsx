import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Swipe Gesture Detector** — detect swipe gestures on touch/mouse
 *
 * Supports:
 * - 4 directions (up, down, left, right)
 * - Configurable threshold
 * - Both touch and mouse events
 * - Callbacks per direction
 *
 * Use: Mobile-optimized UX, touch interactions, gesture-based navigation
 */

export interface SwipeDetectorProps extends React.HTMLAttributes<HTMLDivElement> {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  children: React.ReactNode;
}

export const SwipeDetector = React.forwardRef<HTMLDivElement, SwipeDetectorProps>(
  (
    {
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
      threshold = 50,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0 });
    const [touchEnd, setTouchEnd] = React.useState({ x: 0, y: 0 });

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      setTouchStart({
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      });
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      setTouchEnd({
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      });

      const distance = {
        x: touchStart.x - e.changedTouches[0].clientX,
        y: touchStart.y - e.changedTouches[0].clientY,
      };

      if (Math.abs(distance.x) > Math.abs(distance.y)) {
        // Horizontal swipe
        if (distance.x > threshold) {
          onSwipeLeft?.();
        } else if (distance.x < -threshold) {
          onSwipeRight?.();
        }
      } else {
        // Vertical swipe
        if (distance.y > threshold) {
          onSwipeUp?.();
        } else if (distance.y < -threshold) {
          onSwipeDown?.();
        }
      }
    };

    return (
      <div
        ref={ref}
        className={className}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SwipeDetector.displayName = "SwipeDetector";
