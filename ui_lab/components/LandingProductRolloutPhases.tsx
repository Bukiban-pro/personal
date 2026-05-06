import { cn } from "@/lib/utils";
import * as React from "react";

export interface RolloutPhaseItem {
  title: string;
  audience?: string;
  timing?: string;
  description?: string;
}

export interface LandingProductRolloutPhasesProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  phases: RolloutPhaseItem[];
}

export const LandingProductRolloutPhases = React.forwardRef<
  HTMLElement,
  LandingProductRolloutPhasesProps
>(({ className, title = "Roll out in controlled phases, not one risky jump", description, phases, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {phases.map((phase, index) => (
            <article key={phase.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold tracking-tight">Phase {index + 1}</div>
                {phase.timing ? (
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{phase.timing}</div>
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{phase.title}</h3>
              {phase.audience ? <div className="mt-2 text-sm text-muted-foreground">{phase.audience}</div> : null}
              {phase.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{phase.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductRolloutPhases.displayName = "LandingProductRolloutPhases";