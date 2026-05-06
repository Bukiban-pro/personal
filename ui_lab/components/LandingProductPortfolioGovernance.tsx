import { cn } from "@/lib/utils";
import * as React from "react";

export interface PortfolioGovernanceItem {
  title: string;
  cadence?: string;
  owner?: string;
  description?: string;
}

export interface LandingProductPortfolioGovernanceProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: PortfolioGovernanceItem[];
}

export const LandingProductPortfolioGovernance = React.forwardRef<HTMLElement, LandingProductPortfolioGovernanceProps>(
  ({ className, title = "Show how the portfolio stays governed over time", description, items, ...props }, ref) => {
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
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                  <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.cadence ? <div>{item.cadence}</div> : null}
                    {item.owner ? <div className="mt-1">{item.owner}</div> : null}
                  </div>
                </div>
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductPortfolioGovernance.displayName = "LandingProductPortfolioGovernance";