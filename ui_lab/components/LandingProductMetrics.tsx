import { cn } from "@/lib/utils";
import * as React from "react";

export interface LandingMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface LandingProductMetricsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  metrics: LandingMetric[];
}

export const LandingProductMetrics = React.forwardRef<HTMLElement, LandingProductMetricsProps>(
  ({ className, title, description, metrics, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</div>
                {metric.detail ? <div className="mt-2 text-sm leading-6 text-muted-foreground">{metric.detail}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductMetrics.displayName = "LandingProductMetrics";
