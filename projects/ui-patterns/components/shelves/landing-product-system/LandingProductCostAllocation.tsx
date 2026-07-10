import { cn } from "@/lib/utils";
import * as React from "react";

export interface CostAllocationModel {
  name: string;
  bestFor?: string;
  description?: string;
  signals?: string[];
}

export interface LandingProductCostAllocationProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  models: CostAllocationModel[];
}

export const LandingProductCostAllocation = React.forwardRef<HTMLElement, LandingProductCostAllocationProps>(
  ({ className, title = "Explain how cost allocation works before finance asks", description, models, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {models.map((model) => (
              <article key={model.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {model.bestFor ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{model.bestFor}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{model.name}</h3>
                {model.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{model.description}</p> : null}
                {model.signals?.length ? (
                  <ul className="mt-4 grid gap-2">
                    {model.signals.map((signal) => (
                      <li key={signal} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {signal}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCostAllocation.displayName = "LandingProductCostAllocation";