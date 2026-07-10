import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalRadarSweep {
  title: string;
  source?: string;
  intensity?: string;
  readings?: string[];
  response?: string;
}

export interface LandingProductSignalRadarProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  sweeps: SignalRadarSweep[];
}

export const LandingProductSignalRadar = React.forwardRef<HTMLElement, LandingProductSignalRadarProps>(
  ({ className, title = "Sweep for directional signal before the noise becomes strategy", description, sweeps, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeSweep = sweeps.length > 0 ? sweeps[Math.min(activeIndex, sweeps.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-3">
              {sweeps.map((sweep, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(sweeps.length - 1, 0));

                return (
                  <button
                    key={sweep.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-base font-semibold tracking-tight">{sweep.title}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{sweep.intensity || "Level"}</div>
                    </div>
                    {sweep.source ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{sweep.source}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeSweep ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeSweep.source || "Source"}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeSweep.intensity || "Intensity"}</div>
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeSweep.title}</h3>
                  <div className="mt-6 grid gap-3">
                    {(activeSweep.readings || []).map((reading) => (
                      <div key={reading} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {reading}
                      </div>
                    ))}
                  </div>
                  {activeSweep.response ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeSweep.response}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add sweeps to populate the signal radar.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalRadar.displayName = "LandingProductSignalRadar";