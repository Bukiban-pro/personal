import { cn } from "@/lib/utils";
import * as React from "react";

export interface UsageAnomalyAlert {
  signal: string;
  threshold?: string;
  owner?: string;
  action?: string;
}

export interface LandingProductUsageAnomalyAlertsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  alerts: UsageAnomalyAlert[];
}

export const LandingProductUsageAnomalyAlerts = React.forwardRef<HTMLElement, LandingProductUsageAnomalyAlertsProps>(
  ({ className, title = "Make usage anomalies part of the operating model", description, alerts, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {alerts.map((item) => (
              <article key={item.signal} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight">{item.signal}</h3>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {item.threshold ? <div>Threshold: {item.threshold}</div> : null}
                  {item.owner ? <div>Owner: {item.owner}</div> : null}
                  {item.action ? <div>Action: {item.action}</div> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductUsageAnomalyAlerts.displayName = "LandingProductUsageAnomalyAlerts";