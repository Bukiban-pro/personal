import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingChoreographyMove {
  title: string;
  cadence?: string;
  participants?: string[];
  handoff?: string;
  tension?: string;
}

export interface LandingProductOperatingChoreographyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  moves: OperatingChoreographyMove[];
}

export const LandingProductOperatingChoreography = React.forwardRef<HTMLElement, LandingProductOperatingChoreographyProps>(
  ({ className, title = "Show the operating model as choreography, not just structure", description, moves, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {moves.map((move, index) => (
              <article key={move.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-sm font-semibold tracking-tight">
                  <span>Move {index + 1}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{move.cadence || "Cadence"}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{move.title}</h3>
                {move.participants?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {move.participants.map((participant) => (
                      <span key={participant} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {participant}
                      </span>
                    ))}
                  </div>
                ) : null}
                {move.handoff ? <div className="mt-4 text-sm font-medium text-foreground">{move.handoff}</div> : null}
                {move.tension ? <div className="mt-2 text-sm text-muted-foreground">{move.tension}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperatingChoreography.displayName = "LandingProductOperatingChoreography";