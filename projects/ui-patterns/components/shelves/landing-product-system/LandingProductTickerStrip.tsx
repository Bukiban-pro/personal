import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductTickerStrip
 * Horizontal scrolling ticker strip of key stats, quotes, or milestones.
 * Pattern: Scrolling ticker / news-feed strips seen on Awwwards sites.
 * Inspired by Bold Typography approach from research/CONTENT_STYLE_SELECTION_BRIEF.md.
 */

export interface TickerItem {
  text: string;
  /** Optional accent marker between items */
  marker?: string;
}

export interface LandingProductTickerStripProps extends React.HTMLAttributes<HTMLElement> {
  items?: TickerItem[];
  /** Seconds for one pass. Default 20. */
  duration?: number;
  /** Reverse scroll direction */
  reverse?: boolean;
  /** Accent color class for separator markers */
  markerClass?: string;
  size?: "sm" | "md" | "lg";
}

const DEFAULT_ITEMS: TickerItem[] = [
  { text: "98% forecast accuracy", marker: "✦" },
  { text: "3,200+ teams globally", marker: "✦" },
  { text: "40% pipeline coverage gain", marker: "✦" },
  { text: "60% faster deal reviews", marker: "✦" },
  { text: "$4.2B in closed-won revenue tracked", marker: "✦" },
  { text: "SOC 2 Type II certified", marker: "✦" },
  { text: "Avg 18-day time-to-value", marker: "✦" },
  { text: "Integrates in under 10 minutes", marker: "✦" },
];

const sizeMap = {
  sm: "text-sm font-medium py-3",
  md: "text-base font-semibold py-4",
  lg: "text-xl font-bold py-5",
};

export const LandingProductTickerStrip = React.forwardRef<HTMLElement, LandingProductTickerStripProps>(
  (
    {
      className,
      items = DEFAULT_ITEMS,
      duration = 20,
      reverse = false,
      markerClass = "text-primary",
      size = "md",
      ...props
    },
    ref,
  ) => {
    const doubled = [...items, ...items];

    return (
      <section
        ref={ref}
        className={cn("w-full overflow-hidden border-y border-border bg-card", className)}
        {...props}
      >
        <div
          className={cn("flex items-center whitespace-nowrap", sizeMap[size])}
          style={{
            animation: `ticker-scroll ${duration}s linear infinite${reverse ? " reverse" : ""}`,
            willChange: "transform",
          }}
        >
          {doubled.map((item, i) => (
            <React.Fragment key={i}>
              <span className="px-6">{item.text}</span>
              {item.marker ? (
                <span className={cn("shrink-0", markerClass)}>{item.marker}</span>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        <style>{`
          @keyframes ticker-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </section>
    );
  },
);

LandingProductTickerStrip.displayName = "LandingProductTickerStrip";
