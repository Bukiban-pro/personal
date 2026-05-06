import { cn } from "@/lib/utils";
import * as React from "react";

export interface PricingControlItem {
  title: string;
  impact?: string;
  description?: string;
  owner?: string;
}

export interface LandingProductPricingControlsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  controls: PricingControlItem[];
}

export const LandingProductPricingControls = React.forwardRef<HTMLElement, LandingProductPricingControlsProps>(
  ({ className, title = "Show pricing governance instead of just list price", description, controls, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {controls.map((control) => (
              <article key={control.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">{control.title}</h3>
                  {control.impact ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{control.impact}</div> : null}
                </div>
                {control.owner ? <div className="mt-2 text-sm text-muted-foreground">{control.owner}</div> : null}
                {control.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{control.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductPricingControls.displayName = "LandingProductPricingControls";