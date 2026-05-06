import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalObservatoryLens {
  title: string;
  source?: string;
  anomaly?: string;
  recommendation?: string;
}

export interface LandingProductSignalObservatoryProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  lenses: SignalObservatoryLens[];
}

export const LandingProductSignalObservatory = React.forwardRef<HTMLElement, LandingProductSignalObservatoryProps>(
  ({ className, title = "Observe signal anomalies before they turn into executive surprises", description, lenses, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lenses.map((lens) => (
              <article key={lens.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{lens.source || "Source"}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{lens.title}</h3>
                {lens.anomaly ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{lens.anomaly}</p> : null}
                {lens.recommendation ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{lens.recommendation}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalObservatory.displayName = "LandingProductSignalObservatory";