import { cn } from "@/lib/utils";
import * as React from "react";

export interface ComparisonRow {
  label: string;
  ours: string;
  theirs: string;
}

export interface LandingProductComparisonProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: ComparisonRow[];
  leftLabel?: string;
  rightLabel?: string;
  highlightLeft?: boolean;
}

export const LandingProductComparison = React.forwardRef<HTMLElement, LandingProductComparisonProps>(
  ({ className, title, description, rows, leftLabel = "Ours", rightLabel = "Typical", highlightLeft = true, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-3 border-b border-border bg-muted/50 text-sm font-medium">
              <div className="px-4 py-3">{leftLabel}</div>
              <div className="px-4 py-3">Feature</div>
              <div className="px-4 py-3">{rightLabel}</div>
            </div>

            <div className="divide-y divide-border">
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-3 items-center text-sm">
                  <div className={cn("px-4 py-4", highlightLeft ? "font-medium text-foreground" : "text-muted-foreground")}>{row.ours}</div>
                  <div className="px-4 py-4 font-medium">{row.label}</div>
                  <div className="px-4 py-4 text-muted-foreground">{row.theirs}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductComparison.displayName = "LandingProductComparison";
