import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustBeaconSignal {
  title: string;
  source?: string;
  strength?: string;
  proof?: string;
  nextMove?: string;
}

export interface LandingProductTrustBeaconProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  signals: TrustBeaconSignal[];
}

export const LandingProductTrustBeacon = React.forwardRef<HTMLElement, LandingProductTrustBeaconProps>(
  ({ className, title = "Use trust beacons to show credibility that cuts through noise", description, signals, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {signals.map((signal) => (
              <article key={signal.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{signal.source || "Source"}</span>
                  <span>{signal.strength || "Strength"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{signal.title}</h3>
                {signal.proof ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{signal.proof}</p> : null}
                {signal.nextMove ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{signal.nextMove}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustBeacon.displayName = "LandingProductTrustBeacon";