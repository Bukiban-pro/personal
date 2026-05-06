import { cn } from "@/lib/utils";
import * as React from "react";

export interface StoryBoardroomSeat {
  title: string;
  stakeholder?: string;
  narrative?: string;
  objection?: string;
  decisionCue?: string;
}

export interface LandingProductStoryBoardroomProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  seats: StoryBoardroomSeat[];
}

export const LandingProductStoryBoardroom = React.forwardRef<HTMLElement, LandingProductStoryBoardroomProps>(
  ({ className, title = "Pressure-test the story in the boardroom before it hits the funnel", description, seats, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {seats.map((seat) => (
              <article key={seat.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{seat.title}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{seat.stakeholder || "Seat"}</span>
                </div>
                {seat.narrative ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{seat.narrative}</p> : null}
                {seat.objection ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{seat.objection}</div> : null}
                {seat.decisionCue ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{seat.decisionCue}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStoryBoardroom.displayName = "LandingProductStoryBoardroom";