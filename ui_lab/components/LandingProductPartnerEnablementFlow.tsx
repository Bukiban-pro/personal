import { cn } from "@/lib/utils";
import * as React from "react";

export interface PartnerEnablementFlowItem {
  title: string;
  audience?: string;
  asset?: string;
  description?: string;
}

export interface LandingProductPartnerEnablementFlowProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: PartnerEnablementFlowItem[];
}

export const LandingProductPartnerEnablementFlow = React.forwardRef<HTMLElement, LandingProductPartnerEnablementFlowProps>(
  ({ className, title = "Make partner enablement feel like a flow, not a dump", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {items.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold tracking-tight">Step {index + 1}</div>
                  {item.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.audience}</div> : null}
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                {item.asset ? <div className="mt-4 text-sm font-medium text-foreground">{item.asset}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductPartnerEnablementFlow.displayName = "LandingProductPartnerEnablementFlow";