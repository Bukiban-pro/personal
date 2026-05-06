import { cn } from "@/lib/utils";
import * as React from "react";

export interface MultiteamRolloutWave {
  title: string;
  teams?: string[];
  timing?: string;
  description?: string;
}

export interface LandingProductMultiteamRolloutProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  waves: MultiteamRolloutWave[];
}

export const LandingProductMultiteamRollout = React.forwardRef<
  HTMLElement,
  LandingProductMultiteamRolloutProps
>(({ className, title = "Coordinate rollout across more than one team", description, waves, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {waves.map((wave, index) => (
            <article key={wave.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold tracking-tight">Wave {index + 1}</div>
                {wave.timing ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{wave.timing}</div> : null}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{wave.title}</h3>
              {wave.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{wave.description}</p> : null}
              {wave.teams?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {wave.teams.map((team) => (
                    <span key={team} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{team}</span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductMultiteamRollout.displayName = "LandingProductMultiteamRollout";