import { cn } from "@/lib/utils";
import * as React from "react";

export interface RiskNarrativeItem {
  title: string;
  risk?: string;
  mitigation?: string;
  signal?: string;
}

export interface LandingProductRiskNarrativeProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: RiskNarrativeItem[];
}

export const LandingProductRiskNarrative = React.forwardRef<HTMLElement, LandingProductRiskNarrativeProps>(
  ({ className, title = "Frame risk as something designed, not feared", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                {item.risk ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.risk}</p> : null}
                <div className="mt-4 grid gap-3">
                  {item.mitigation ? (
                    <div className="rounded-xl border border-border bg-primary/5 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mitigation</div>
                      <div className="mt-2 text-sm font-medium">{item.mitigation}</div>
                    </div>
                  ) : null}
                  {item.signal ? (
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Signal</div>
                      <div className="mt-2 text-sm font-medium">{item.signal}</div>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRiskNarrative.displayName = "LandingProductRiskNarrative";