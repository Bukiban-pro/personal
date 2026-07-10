import { cn } from "@/lib/utils";
import * as React from "react";

export interface TerritoryCapacityRow {
  territory: string;
  current: string;
  planned: string;
  trigger?: string;
}

export interface LandingProductTerritoryCapacityModelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: TerritoryCapacityRow[];
}

export const LandingProductTerritoryCapacityModel = React.forwardRef<HTMLElement, LandingProductTerritoryCapacityModelProps>(
  ({ className, title = "Model territory capacity before expansion stalls", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1fr_0.8fr_0.8fr_1fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Territory</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Current</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Planned</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Trigger</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.territory} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_0.8fr_0.8fr_1fr] md:px-6">
                  <div className="text-base font-semibold tracking-tight">{row.territory}</div>
                  <div className="text-sm text-muted-foreground">{row.current}</div>
                  <div className="text-sm text-muted-foreground">{row.planned}</div>
                  <div className="text-sm text-muted-foreground">{row.trigger || "Demand threshold"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTerritoryCapacityModel.displayName = "LandingProductTerritoryCapacityModel";