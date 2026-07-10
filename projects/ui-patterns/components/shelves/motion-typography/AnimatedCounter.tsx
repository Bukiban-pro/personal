import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Animated Counter / Stats Counter** — auto-incrementing number display
 *
 * Supports:
 * - Start → End animation
 * - Custom duration & easing
 * - Trigger on intersection/interaction
 * - Prefix/suffix formatting
 * - Decimal precision
 *
 * Use: Statistics, milestones, achievements
 */

export interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  trigger?: "intersection" | "immediate";
  easing?: "linear" | "ease-out-quad" | "ease-out-cubic";
}

export const Counter = React.forwardRef<HTMLDivElement, CounterProps>(
  (
    {
      from,
      to,
      duration = 2,
      decimals = 0,
      prefix = "",
      suffix = "",
      trigger = "intersection",
      easing = "ease-out-quad",
      className,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = React.useState(from);
    const [hasStarted, setHasStarted] = React.useState(trigger === "immediate");

    const getEasing = (progress: number) => {
      if (easing === "linear") return progress;
      if (easing === "ease-out-quad") return 1 - Math.pow(1 - progress, 2);
      if (easing === "ease-out-cubic") return 1 - Math.pow(1 - progress, 3);
      return progress;
    };

    React.useEffect(() => {
      if (!hasStarted) return;

      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = getEasing(progress);
        const currentValue = from + (to - from) * easedProgress;

        setValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [hasStarted, from, to, duration, easing]);

    React.useEffect(() => {
      if (trigger !== "intersection") return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      });

      if (ref && typeof ref === "object" && ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, [trigger, hasStarted, ref]);

    return (
      <div
        ref={ref}
        className={className}
        {...props}
      >
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </div>
    );
  },
);

Counter.displayName = "Counter";
