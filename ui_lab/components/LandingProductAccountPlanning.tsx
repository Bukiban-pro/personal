import { cn } from "@/lib/utils";
import * as React from "react";

export interface AccountPlanningItem {
  title: string;
  stakeholder?: string;
  objective?: string;
  nextStep?: string;
}

export interface LandingProductAccountPlanningProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: AccountPlanningItem[];
}

export const LandingProductAccountPlanning = React.forwardRef<HTMLElement, LandingProductAccountPlanningProps>(
  ({ className, title = "Make account planning more operational than aspirational", description, items, ...props }, ref) => {
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
                <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                {item.stakeholder ? <div className="mt-2 text-sm text-muted-foreground">{item.stakeholder}</div> : null}
                {item.objective ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.objective}</p> : null}
                {item.nextStep ? <div className="mt-4 text-sm font-medium text-foreground">Next: {item.nextStep}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductAccountPlanning.displayName = "LandingProductAccountPlanning";