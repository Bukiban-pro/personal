import { cn } from "@/lib/utils";
import * as React from "react";

export interface RecoveryProtocolPhase {
  title: string;
  threshold?: string;
  motion?: string;
  owner?: string;
  note?: string;
}

export interface LandingProductRecoveryProtocolProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  phases: RecoveryProtocolPhase[];
}

export const LandingProductRecoveryProtocol = React.forwardRef<HTMLElement, LandingProductRecoveryProtocolProps>(
  ({ className, title = "Encode recovery as protocol before failure improvises the response", description, phases, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {phases.map((phase, index) => (
              <article key={phase.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold tracking-tight">Phase {index + 1}</div>
                  {phase.owner ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{phase.owner}</div> : null}
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{phase.title}</h3>
                {phase.threshold ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{phase.threshold}</p> : null}
                {phase.motion ? <div className="mt-4 text-sm font-medium text-foreground">{phase.motion}</div> : null}
                {phase.note ? <div className="mt-2 text-sm text-muted-foreground">{phase.note}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRecoveryProtocol.displayName = "LandingProductRecoveryProtocol";