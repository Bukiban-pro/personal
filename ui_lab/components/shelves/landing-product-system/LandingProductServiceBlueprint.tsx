import { cn } from "@/lib/utils";
import * as React from "react";

export interface ServiceBlueprintRow {
  layer: string;
  frontstage: string;
  backstage: string;
  metric?: string;
}

export interface LandingProductServiceBlueprintProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: ServiceBlueprintRow[];
}

export const LandingProductServiceBlueprint = React.forwardRef<HTMLElement, LandingProductServiceBlueprintProps>(
  ({ className, title = "Show the service blueprint, not just the interface", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.8fr_1fr_1fr_0.8fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Layer</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Frontstage</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Backstage</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Metric</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.layer} className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_1fr_1fr_0.8fr] md:px-6">
                  <div className="text-sm font-medium">{row.layer}</div>
                  <div className="text-sm text-muted-foreground">{row.frontstage}</div>
                  <div className="text-sm text-muted-foreground">{row.backstage}</div>
                  <div className="text-sm text-muted-foreground">{row.metric || "Outcome"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductServiceBlueprint.displayName = "LandingProductServiceBlueprint";