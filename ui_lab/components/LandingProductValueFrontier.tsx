import { cn } from "@/lib/utils";
import * as React from "react";

export interface ValueFrontierZone {
  title: string;
  territory?: string;
  upside?: string;
  hazards?: string[];
  move?: string;
}

export interface LandingProductValueFrontierProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  zones: ValueFrontierZone[];
}

export const LandingProductValueFrontier = React.forwardRef<HTMLElement, LandingProductValueFrontierProps>(
  ({ className, title = "Push value work toward the frontier where upside and risk are both visible", description, zones, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeZone = zones.length > 0 ? zones[Math.min(activeIndex, zones.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-3">
              {zones.map((zone, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(zones.length - 1, 0));

                return (
                  <button
                    key={zone.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{zone.title}</div>
                    {zone.territory ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{zone.territory}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeZone ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeZone.territory || "Territory"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeZone.title}</h3>
                  {activeZone.upside ? <div className="mt-6 rounded-2xl border border-border bg-background px-5 py-4 text-sm text-muted-foreground">{activeZone.upside}</div> : null}
                  <div className="mt-6 grid gap-3">
                    {(activeZone.hazards || []).map((hazard) => (
                      <div key={hazard} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {hazard}
                      </div>
                    ))}
                  </div>
                  {activeZone.move ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeZone.move}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add zones to populate the value frontier.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductValueFrontier.displayName = "LandingProductValueFrontier";