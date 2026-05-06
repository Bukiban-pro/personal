'use client';

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * Animated marquee / scrolling carousel — loops children horizontally.
 *
 * `animationDirection`: `'left'` (default) scrolls left; `'right'` scrolls right.
 * `animationDurationInSeconds`: Override auto-calculated duration.
 * The component auto-repeats children to fill viewport width for seamless looping.
 *
 * **CSS requirement**: Add to your global CSS:
 * ```css
 * @keyframes marquee {
 *   0% { transform: translateX(0); }
 *   100% { transform: translateX(-100%); }
 * }
 * .animate-marquee {
 *   animation: marquee linear infinite;
 * }
 * .direction-reverse {
 *   animation-direction: reverse;
 * }
 * ```
 */
export const LandingMarquee = ({
  className,
  children,
  innerClassName,
  withBackground = false,
  animationDurationInSeconds,
  animationDirection,
  variant = "primary",
}: {
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
  withBackground?: boolean;
  animationDurationInSeconds?: number;
  animationDirection?: "left" | "right";
  variant?: "primary" | "secondary";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(3);
  const [_animationDuration, _setAnimationDuration] = useState("15s");

  useEffect(() => {
    const updateRepeatCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const firstChild = containerRef.current.firstChild as HTMLElement | null;
        const grandChild = firstChild?.firstChild as HTMLElement | null;
        const childWidth = grandChild?.offsetWidth || 1;
        const visibleItems = Math.ceil(containerWidth / childWidth);
        setRepeat(visibleItems + 1);

        if (animationDurationInSeconds) {
          _setAnimationDuration(`${animationDurationInSeconds}s`);
        } else {
          const duration = (containerWidth / 100) * 15;
          _setAnimationDuration(`${duration}s`);
        }
      }
    };

    updateRepeatCount();
    window.addEventListener("resize", updateRepeatCount);
    return () => window.removeEventListener("resize", updateRepeatCount);
  }, [animationDurationInSeconds]);

  return (
    <div
      className={cn(
        "w-full overflow-hidden flex items-center py-4 lg:py-8",
        withBackground && variant === "primary"
          ? "bg-primary/10 dark:bg-primary/20"
          : "",
        withBackground && variant === "secondary"
          ? "bg-secondary/10 dark:bg-secondary/20"
          : "",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn(
          "flex animate-marquee",
          animationDirection === "left" ? "" : "direction-reverse",
          innerClassName,
        )}
        style={{
          width: `${repeat * 100}%`,
          animationDuration: _animationDuration,
        }}
      >
        {Array.from({ length: repeat }, () => children)
          .flat()
          .map((child, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-shrink-0"
            >
              {child}
            </div>
          ))}
      </div>
    </div>
  );
};
