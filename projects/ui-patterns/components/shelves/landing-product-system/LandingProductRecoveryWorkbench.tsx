import { cn } from "@/lib/utils";
import * as React from "react";

export interface RecoveryWorkbenchMode {
  title: string;
  scenario?: string;
  checks?: string[];
  responses?: string[];
  owner?: string;
}

export interface LandingProductRecoveryWorkbenchProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  modes: RecoveryWorkbenchMode[];
}

export const LandingProductRecoveryWorkbench = React.forwardRef<HTMLElement, LandingProductRecoveryWorkbenchProps>(
  ({ className, title = "Give the team a workbench for rehearsing recovery, not just documenting it", description, modes, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeMode = modes.length > 0 ? modes[Math.min(activeIndex, modes.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {modes.map((mode, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(modes.length - 1, 0));

                return (
                  <button
                    key={mode.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{mode.title}</div>
                    {mode.scenario ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{mode.scenario}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeMode ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeMode.owner || "Owner"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeMode.title}</h3>
                  {activeMode.scenario ? <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{activeMode.scenario}</p> : null}
                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Checks</div>
                      <div className="mt-3 grid gap-3">
                        {(activeMode.checks || []).map((check) => (
                          <div key={check} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                            {check}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Responses</div>
                      <div className="mt-3 grid gap-3">
                        {(activeMode.responses || []).map((response) => (
                          <div key={response} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                            {response}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add modes to populate the recovery workbench.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRecoveryWorkbench.displayName = "LandingProductRecoveryWorkbench";