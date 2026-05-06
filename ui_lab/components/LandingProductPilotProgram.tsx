import { cn } from "@/lib/utils";
import * as React from "react";

export interface PilotProgramPhase {
  title: string;
  duration?: string;
  goal?: string;
  outputs?: string[];
}

export interface LandingProductPilotProgramProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  phases: PilotProgramPhase[];
  action?: React.ReactNode;
}

export const LandingProductPilotProgram = React.forwardRef<
  HTMLElement,
  LandingProductPilotProgramProps
>(({ className, title = "Structure the pilot before anyone asks for proof", description, phases, action, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {phases.map((phase, index) => (
            <article key={phase.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
                  {index + 1}
                </div>
                {phase.duration ? (
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {phase.duration}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{phase.title}</h3>
              {phase.goal ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{phase.goal}</p> : null}
              {phase.outputs?.length ? (
                <ul className="mt-4 grid gap-2">
                  {phase.outputs.map((output) => (
                    <li key={output} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {output}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductPilotProgram.displayName = "LandingProductPilotProgram";