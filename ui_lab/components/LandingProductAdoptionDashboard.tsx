import { cn } from "@/lib/utils";
import * as React from "react";

export interface AdoptionDashboardMetric {
  label: string;
  value: string;
  target?: string;
  detail?: string;
}

export interface LandingProductAdoptionDashboardProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  metrics: AdoptionDashboardMetric[];
  summary?: string;
}

export const LandingProductAdoptionDashboard = React.forwardRef<
  HTMLElement,
  LandingProductAdoptionDashboardProps
>(({ className, title = "Show adoption progress in buyer language", description, metrics, summary, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-border bg-muted/30 p-5">
                <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</div>
                {metric.target ? (
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Target: {metric.target}
                  </div>
                ) : null}
                {metric.detail ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{metric.detail}</p> : null}
              </article>
            ))}
          </div>

          {summary ? <p className="mt-6 text-sm leading-7 text-muted-foreground md:text-base">{summary}</p> : null}
        </div>
      </div>
    </section>
  );
});

LandingProductAdoptionDashboard.displayName = "LandingProductAdoptionDashboard";