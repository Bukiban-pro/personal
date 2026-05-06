import { cn } from "@/lib/utils";
import * as React from "react";

export interface BenchmarkItem {
  metric: string;
  ourValue: string;
  baselineValue: string;
  note?: string;
}

export interface LandingProductBenchmarkCardsProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  benchmarks: BenchmarkItem[];
}

export const LandingProductBenchmarkCards = React.forwardRef<
  HTMLElement,
  LandingProductBenchmarkCardsProps
>(({ className, title = "Benchmark", description, benchmarks, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {benchmarks.map((item) => (
            <article key={item.metric} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">{item.metric}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-primary/10 px-3 py-2 text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-primary">Ours</div>
                  <div className="mt-1 text-sm font-semibold">{item.ourValue}</div>
                </div>
                <div className="rounded-xl bg-muted px-3 py-2 text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Baseline</div>
                  <div className="mt-1 text-sm font-semibold">{item.baselineValue}</div>
                </div>
              </div>
              {item.note ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.note}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductBenchmarkCards.displayName = "LandingProductBenchmarkCards";
