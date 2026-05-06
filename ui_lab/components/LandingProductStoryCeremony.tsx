import { cn } from "@/lib/utils";
import * as React from "react";

export interface StoryCeremonyPhase {
  title: string;
  ritual?: string;
  inputs?: string[];
  output?: string;
  vow?: string;
}

export interface LandingProductStoryCeremonyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  phases: StoryCeremonyPhase[];
}

export const LandingProductStoryCeremony = React.forwardRef<HTMLElement, LandingProductStoryCeremonyProps>(
  ({ className, title = "Treat the narrative as a ceremony with phases, vows, and outputs", description, phases, ...props }, ref) => {
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
                <div className="text-sm font-semibold tracking-tight">Phase {index + 1}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{phase.title}</h3>
                {phase.ritual ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{phase.ritual}</p> : null}
                <div className="mt-4 grid gap-3">
                  {(phase.inputs || []).map((input) => (
                    <div key={input} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {input}
                    </div>
                  ))}
                </div>
                {phase.output ? <div className="mt-4 text-sm font-medium text-foreground">{phase.output}</div> : null}
                {phase.vow ? <div className="mt-2 text-sm text-muted-foreground">{phase.vow}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStoryCeremony.displayName = "LandingProductStoryCeremony";