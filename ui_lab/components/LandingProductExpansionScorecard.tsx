import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExpansionScorecardRow {
  segment: string;
  readiness: string;
  opportunity: string;
  evidence?: string;
}

export interface LandingProductExpansionScorecardProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: ExpansionScorecardRow[];
}

export const LandingProductExpansionScorecard = React.forwardRef<
  HTMLElement,
  LandingProductExpansionScorecardProps
>(({ className, title = "Prioritize expansion with a visible scorecard", description, rows, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1fr_0.8fr_0.8fr]">
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Segment</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Readiness</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Opportunity</div>
          </div>
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <article key={row.segment} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_0.8fr_0.8fr] md:px-6">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{row.segment}</h3>
                  {row.evidence ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.evidence}</p> : null}
                </div>
                <div className="text-sm text-muted-foreground">{row.readiness}</div>
                <div className="text-sm text-muted-foreground">{row.opportunity}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductExpansionScorecard.displayName = "LandingProductExpansionScorecard";