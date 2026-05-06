import { cn } from "@/lib/utils";
import * as React from "react";

export interface RecoveryTabletopScenario {
  title: string;
  stressor?: string;
  participants?: string[];
  decisionPath?: string;
  lesson?: string;
}

export interface LandingProductRecoveryTabletopProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  scenarios: RecoveryTabletopScenario[];
}

export const LandingProductRecoveryTabletop = React.forwardRef<HTMLElement, LandingProductRecoveryTabletopProps>(
  ({ className, title = "Pressure-test recovery in tabletop scenarios before the incident is real", description, scenarios, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <article key={scenario.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{scenario.title}</h3>
                {scenario.stressor ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario.stressor}</p> : null}
                {scenario.participants?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {scenario.participants.map((participant) => (
                      <span key={participant} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {participant}
                      </span>
                    ))}
                  </div>
                ) : null}
                {scenario.decisionPath ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{scenario.decisionPath}</div> : null}
                {scenario.lesson ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{scenario.lesson}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRecoveryTabletop.displayName = "LandingProductRecoveryTabletop";