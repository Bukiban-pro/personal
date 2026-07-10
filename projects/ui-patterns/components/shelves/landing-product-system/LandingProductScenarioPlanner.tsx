import { cn } from "@/lib/utils";
import * as React from "react";

export interface ScenarioPlannerMetric {
  label: string;
  value: string;
}

export interface ScenarioPlannerScenario {
  name: string;
  summary?: string;
  metrics?: ScenarioPlannerMetric[];
  considerations?: string[];
  action?: React.ReactNode;
}

export interface LandingProductScenarioPlannerProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  scenarios: ScenarioPlannerScenario[];
}

export const LandingProductScenarioPlanner = React.forwardRef<
  HTMLElement,
  LandingProductScenarioPlannerProps
>(({ className, title = "Let buyers compare scenarios without a spreadsheet detour", description, scenarios, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeScenario = scenarios.length > 0 ? scenarios[Math.min(activeIndex, scenarios.length - 1)] : null;

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr]">
          <div className="space-y-3">
            {scenarios.map((scenario, index) => {
              const isActive = index === Math.min(activeIndex, Math.max(scenarios.length - 1, 0));

              return (
                <button key={scenario.name} type="button" onClick={() => setActiveIndex(index)} className={cn("w-full rounded-2xl border p-5 text-left transition-colors", isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40")}>
                  <div className="text-base font-semibold tracking-tight">{scenario.name}</div>
                  {scenario.summary ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario.summary}</p> : null}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
            {activeScenario ? (
              <>
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{activeScenario.name}</h3>
                {activeScenario.summary ? <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{activeScenario.summary}</p> : null}

                {activeScenario.metrics?.length ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {activeScenario.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-border bg-muted/30 p-4">
                        <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeScenario.considerations?.length ? (
                  <div className="mt-6 grid gap-3">
                    {activeScenario.considerations.map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeScenario.action ? <div className="mt-6">{activeScenario.action}</div> : null}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Add scenarios to populate the planner.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductScenarioPlanner.displayName = "LandingProductScenarioPlanner";