import { cn } from "@/lib/utils";
import * as React from "react";

export interface CustomerJourneyStage {
  title: string;
  emotion?: string;
  signal?: string;
  detail?: string;
}

export interface LandingProductCustomerJourneyMapProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: CustomerJourneyStage[];
}

export const LandingProductCustomerJourneyMap = React.forwardRef<HTMLElement, LandingProductCustomerJourneyMapProps>(
  ({ className, title = "Plot the customer journey with more nuance than a funnel", description, stages, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {stages.map((stage) => (
              <article key={stage.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{stage.emotion || "Emotion"}</span>
                  <span>{stage.signal || "Signal"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{stage.title}</h3>
                {stage.detail ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.detail}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCustomerJourneyMap.displayName = "LandingProductCustomerJourneyMap";