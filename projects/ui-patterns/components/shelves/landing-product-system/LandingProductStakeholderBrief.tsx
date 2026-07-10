import { cn } from "@/lib/utils";
import * as React from "react";

export interface StakeholderBriefItem {
  title: string;
  priority?: string;
  concern?: string;
  response?: string;
}

export interface LandingProductStakeholderBriefProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: StakeholderBriefItem[];
}

export const LandingProductStakeholderBrief = React.forwardRef<HTMLElement, LandingProductStakeholderBriefProps>(
  ({ className, title = "Package each stakeholder brief as a clean decision aid", description, items, ...props }, ref) => {
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
                  <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                  {item.priority ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.priority}</div> : null}
                </div>
                {item.concern ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.concern}</p> : null}
                {item.response ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{item.response}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStakeholderBrief.displayName = "LandingProductStakeholderBrief";