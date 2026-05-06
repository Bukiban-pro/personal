import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExecutiveSummaryStat {
  label: string;
  value: string;
  context?: string;
}

export interface ExecutiveSummaryHighlight {
  title: string;
  detail: string;
}

export interface LandingProductExecutiveSummaryProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stats: ExecutiveSummaryStat[];
  highlights: ExecutiveSummaryHighlight[];
  action?: React.ReactNode;
}

export const LandingProductExecutiveSummary = React.forwardRef<
  HTMLElement,
  LandingProductExecutiveSummaryProps
>(({ className, title = "Give executives the 60-second version", description, stats, highlights, action, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-border bg-muted/30 p-5">
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{stat.value}</div>
                {stat.context ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.context}</p> : null}
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {highlights.map((highlight) => (
            <article key={highlight.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">{highlight.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{highlight.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductExecutiveSummary.displayName = "LandingProductExecutiveSummary";