import { cn } from "@/lib/utils";
import * as React from "react";

export interface AdoptionBlueprintRow {
  audience: string;
  milestone?: string;
  support?: string;
  measure?: string;
}

export interface LandingProductAdoptionBlueprintProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: AdoptionBlueprintRow[];
}

export const LandingProductAdoptionBlueprint = React.forwardRef<HTMLElement, LandingProductAdoptionBlueprintProps>(
  ({ className, title = "Blueprint adoption by audience and proof point", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.8fr_1fr_1fr_0.8fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Audience</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Milestone</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Support Motion</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Measure</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.audience} className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_1fr_1fr_0.8fr] md:px-6">
                  <div className="text-sm font-medium">{row.audience}</div>
                  <div className="text-sm text-muted-foreground">{row.milestone || "Activation"}</div>
                  <div className="text-sm text-muted-foreground">{row.support || "Enablement"}</div>
                  <div className="text-sm text-muted-foreground">{row.measure || "Engagement"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductAdoptionBlueprint.displayName = "LandingProductAdoptionBlueprint";