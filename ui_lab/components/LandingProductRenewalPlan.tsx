import { cn } from "@/lib/utils";
import * as React from "react";

export interface RenewalPlanItem {
  title: string;
  timeframe?: string;
  owner?: string;
  description?: string;
}

export interface LandingProductRenewalPlanProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: RenewalPlanItem[];
}

export const LandingProductRenewalPlan = React.forwardRef<
  HTMLElement,
  LandingProductRenewalPlanProps
>(({ className, title = "Lay out renewal steps before the deadline compresses everything", description, items, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="relative grid gap-4">
          <div className="absolute bottom-0 left-5 top-3 hidden w-px bg-border md:block" aria-hidden="true" />
          {items.map((item, index) => (
            <article key={item.title} className="relative grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-[auto_1fr] md:gap-5 md:p-6">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">{index + 1}</div>
              <div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-base font-semibold tracking-tight md:text-lg">{item.title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.timeframe ? <span>{item.timeframe}</span> : null}
                    {item.owner ? <span>{item.owner}</span> : null}
                  </div>
                </div>
                {item.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductRenewalPlan.displayName = "LandingProductRenewalPlan";