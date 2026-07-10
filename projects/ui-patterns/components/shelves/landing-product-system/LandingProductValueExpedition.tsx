import { cn } from "@/lib/utils";
import * as React from "react";

export interface ValueExpeditionLeg {
  title: string;
  terrain?: string;
  objective?: string;
  obstacles?: string[];
  advance?: string;
}

export interface LandingProductValueExpeditionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  legs: ValueExpeditionLeg[];
}

export const LandingProductValueExpedition = React.forwardRef<HTMLElement, LandingProductValueExpeditionProps>(
  ({ className, title = "Treat value realization as an expedition through real terrain", description, legs, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeLeg = legs.length > 0 ? legs[Math.min(activeIndex, legs.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-3">
              {legs.map((leg, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(legs.length - 1, 0));

                return (
                  <button
                    key={leg.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{leg.title}</div>
                    {leg.terrain ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{leg.terrain}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeLeg ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeLeg.terrain || "Terrain"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeLeg.title}</h3>
                  {activeLeg.objective ? <div className="mt-6 rounded-2xl border border-border bg-background px-5 py-4 text-sm text-muted-foreground">{activeLeg.objective}</div> : null}
                  <div className="mt-6 grid gap-3">
                    {(activeLeg.obstacles || []).map((obstacle) => (
                      <div key={obstacle} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {obstacle}
                      </div>
                    ))}
                  </div>
                  {activeLeg.advance ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeLeg.advance}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add legs to populate the value expedition.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductValueExpedition.displayName = "LandingProductValueExpedition";