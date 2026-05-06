import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingHorizonZone {
  title: string;
  horizon?: string;
  movement?: string;
  watchpoints?: string[];
  action?: string;
}

export interface LandingProductOperatingHorizonProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  zones: OperatingHorizonZone[];
}

export const LandingProductOperatingHorizon = React.forwardRef<HTMLElement, LandingProductOperatingHorizonProps>(
  ({ className, title = "Read the operating horizon before structural shifts hit the team", description, zones, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {zones.map((zone) => (
              <article key={zone.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{zone.horizon || "Horizon"}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{zone.title}</h3>
                {zone.movement ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{zone.movement}</p> : null}
                <div className="mt-4 grid gap-3">
                  {(zone.watchpoints || []).map((watchpoint) => (
                    <div key={watchpoint} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {watchpoint}
                    </div>
                  ))}
                </div>
                {zone.action ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{zone.action}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperatingHorizon.displayName = "LandingProductOperatingHorizon";