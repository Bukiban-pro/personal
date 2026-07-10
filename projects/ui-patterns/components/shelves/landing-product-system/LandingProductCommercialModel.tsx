import { cn } from "@/lib/utils";
import * as React from "react";

export interface CommercialModelTier {
  title: string;
  buyer?: string;
  structure?: string;
  description?: string;
  note?: string;
}

export interface LandingProductCommercialModelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  tiers: CommercialModelTier[];
}

export const LandingProductCommercialModel = React.forwardRef<HTMLElement, LandingProductCommercialModelProps>(
  ({ className, title = "Show the commercial model with more precision than pricing", description, tiers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article key={tier.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{tier.title}</h3>
                  {tier.buyer ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{tier.buyer}</div> : null}
                </div>
                {tier.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{tier.description}</p> : null}
                {tier.structure ? <div className="mt-4 text-sm font-medium text-foreground">{tier.structure}</div> : null}
                {tier.note ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{tier.note}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCommercialModel.displayName = "LandingProductCommercialModel";