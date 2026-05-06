import { cn } from "@/lib/utils";
import * as React from "react";

export interface BuyingCommitteeScenario {
  title: string;
  stakeholder?: string;
  objection?: string;
  countermove?: string;
  proof?: string[];
}

export interface LandingProductBuyingCommitteeSimulatorProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  scenarios: BuyingCommitteeScenario[];
}

export const LandingProductBuyingCommitteeSimulator = React.forwardRef<HTMLElement, LandingProductBuyingCommitteeSimulatorProps>(
  ({ className, title = "Simulate the buying committee before the room goes live", description, scenarios, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeScenario = scenarios.length > 0 ? scenarios[Math.min(activeIndex, scenarios.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {scenarios.map((scenario, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(scenarios.length - 1, 0));

                return (
                  <button
                    key={scenario.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{scenario.title}</div>
                    {scenario.stakeholder ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario.stakeholder}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeScenario ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeScenario.stakeholder || "Stakeholder"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeScenario.title}</h3>
                  {activeScenario.objection ? <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{activeScenario.objection}</p> : null}
                  {activeScenario.countermove ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeScenario.countermove}</div> : null}
                  <div className="mt-6 grid gap-3">
                    {(activeScenario.proof || []).map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add scenarios to populate the simulator.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBuyingCommitteeSimulator.displayName = "LandingProductBuyingCommitteeSimulator";