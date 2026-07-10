import { cn } from "@/lib/utils";
import * as React from "react";

export interface InfluenceBoardLane {
  title: string;
  owner?: string;
  moves?: string[];
  blockers?: string[];
  nextMove?: string;
}

export interface LandingProductInfluenceBoardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  lanes: InfluenceBoardLane[];
}

export const LandingProductInfluenceBoard = React.forwardRef<HTMLElement, LandingProductInfluenceBoardProps>(
  ({ className, title = "Run stakeholder influence like a board of lanes, blockers, and next moves", description, lanes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {lanes.map((lane) => (
              <article key={lane.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{lane.title}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{lane.owner || "Owner"}</span>
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Moves</div>
                    <div className="mt-3 grid gap-3">
                      {(lane.moves || []).map((move) => (
                        <div key={move} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                          {move}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Blockers</div>
                    <div className="mt-3 grid gap-3">
                      {(lane.blockers || []).map((blocker) => (
                        <div key={blocker} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                          {blocker}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {lane.nextMove ? <div className="mt-5 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{lane.nextMove}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductInfluenceBoard.displayName = "LandingProductInfluenceBoard";