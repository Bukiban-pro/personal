import { cn } from "@/lib/utils";
import * as React from "react";

export interface BoardReportingMetric {
  label: string;
  value: string;
  note?: string;
}

export interface BoardReportingNarrative {
  title: string;
  detail: string;
}

export interface LandingProductBoardReportingProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  metrics: BoardReportingMetric[];
  narratives: BoardReportingNarrative[];
}

export const LandingProductBoardReporting = React.forwardRef<HTMLElement, LandingProductBoardReportingProps>(
  ({ className, title = "Turn operating detail into board-ready reporting", description, metrics, narratives, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <article key={metric.label} className="rounded-2xl border border-border bg-muted/30 p-5">
                  <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</div>
                  {metric.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{metric.note}</p> : null}
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {narratives.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBoardReporting.displayName = "LandingProductBoardReporting";