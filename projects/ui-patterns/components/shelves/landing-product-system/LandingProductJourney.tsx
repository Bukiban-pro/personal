import { cn } from "@/lib/utils";
import * as React from "react";

export interface JourneyStage {
  title: string;
  description?: string;
  status?: "complete" | "active" | "upcoming";
}

export interface LandingProductJourneyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: JourneyStage[];
}

export const LandingProductJourney = React.forwardRef<HTMLElement, LandingProductJourneyProps>(
  ({ className, title = "Journey", description, stages, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stages.map((stage, index) => {
              const stateStyles = {
                complete: "border-emerald-500/30 bg-emerald-500/10",
                active: "border-primary/30 bg-primary/10",
                upcoming: "border-border bg-card",
              } as const;
              const state = stage.status || (index === 0 ? "active" : "upcoming");

              return (
                <div key={stage.title} className={cn("rounded-2xl border p-6 shadow-sm", stateStyles[state])}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-10 w-10 rounded-full border border-current/20 bg-background flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{state}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{stage.title}</h3>
                  {stage.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.description}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductJourney.displayName = "LandingProductJourney";
