import { cn } from "@/lib/utils";
import * as React from "react";

export interface CaseStudyStat {
  label: string;
  value: string;
}

export interface LandingProductCaseStudyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  summary?: string;
  stats: CaseStudyStat[];
  quote?: string;
  author?: string;
}

export const LandingProductCaseStudy = React.forwardRef<HTMLElement, LandingProductCaseStudyProps>(
  ({ className, title, subtitle, summary, stats, quote, author, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8">
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {subtitle ? <p className="text-lg font-medium text-muted-foreground">{subtitle}</p> : null}
            {summary ? <p className="max-w-2xl text-base leading-7 text-muted-foreground">{summary}</p> : null}

            {quote ? (
              <blockquote className="mt-4 border-l-2 border-primary pl-4 text-base leading-7 text-foreground">
                {quote}
                {author ? <footer className="mt-2 text-sm text-muted-foreground">{author}</footer> : null}
              </blockquote>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-muted/40 p-6">
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCaseStudy.displayName = "LandingProductCaseStudy";
