import { cn } from "@/lib/utils";
import * as React from "react";

export interface CustomerHealthFactor {
  label: string;
  value: string;
  trend?: string;
  detail?: string;
}

export interface LandingProductCustomerHealthProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  summaryValue: string;
  summaryLabel?: string;
  factors: CustomerHealthFactor[];
}

export const LandingProductCustomerHealth = React.forwardRef<
  HTMLElement,
  LandingProductCustomerHealthProps
>(({ className, title = "Translate customer health into visible operational signals", description, summaryValue, summaryLabel = "Health summary", factors, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">{summaryLabel}</div>
          <div className="mt-4 text-6xl font-semibold tracking-tight">{summaryValue}</div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {factors.map((factor) => (
            <article key={factor.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-medium text-muted-foreground">{factor.label}</div>
                {factor.trend ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{factor.trend}</div> : null}
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{factor.value}</div>
              {factor.detail ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{factor.detail}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductCustomerHealth.displayName = "LandingProductCustomerHealth";