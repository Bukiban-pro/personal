import { cn } from "@/lib/utils";
import * as React from "react";

export interface BoardroomSystemSeat {
  title: string;
  stakeholder?: string;
  metric?: string;
  concern?: string;
  decision?: string;
}

export interface LandingProductBoardroomSystemProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  seats: BoardroomSystemSeat[];
}

export const LandingProductBoardroomSystem = React.forwardRef<HTMLElement, LandingProductBoardroomSystemProps>(
  ({ className, title = "Model the boardroom as a system of seats, concerns, and decisions", description, seats, ...props }, ref) => {
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
                {seat.metric ? <div className="mt-4 text-2xl font-semibold tracking-tight">{seat.metric}</div> : null}
                {seat.concern ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{seat.concern}</div> : null}
                {seat.decision ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{seat.decision}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBoardroomSystem.displayName = "LandingProductBoardroomSystem";