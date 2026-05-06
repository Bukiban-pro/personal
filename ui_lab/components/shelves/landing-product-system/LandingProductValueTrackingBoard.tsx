import { cn } from "@/lib/utils";
import * as React from "react";

export interface ValueTrackingMetric {
  label: string;
  baseline: string;
  current: string;
  target?: string;
}

export interface LandingProductValueTrackingBoardProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  metrics: ValueTrackingMetric[];
}

export const LandingProductValueTrackingBoard = React.forwardRef<
  HTMLElement,
  LandingProductValueTrackingBoardProps
>(({ className, title = "Track value creation with a simple buyer-facing board", description, metrics, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr]">
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Metric</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Baseline</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Current</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Target</div>
          </div>
          <div className="divide-y divide-border">
            {metrics.map((metric) => (
              <article key={metric.label} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr] md:px-6">
                <div className="text-base font-semibold tracking-tight">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.baseline}</div>
                <div className="text-sm text-muted-foreground">{metric.current}</div>
                <div className="text-sm text-muted-foreground">{metric.target || "In progress"}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductValueTrackingBoard.displayName = "LandingProductValueTrackingBoard";