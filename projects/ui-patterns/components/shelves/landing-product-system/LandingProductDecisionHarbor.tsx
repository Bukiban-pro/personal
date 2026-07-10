import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionHarborEntry {
  title: string;
  arrival?: string;
  cargo?: string;
  berth?: string;
  departure?: string;
}

export interface LandingProductDecisionHarborProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  entries: DecisionHarborEntry[];
}

export const LandingProductDecisionHarbor = React.forwardRef<HTMLElement, LandingProductDecisionHarborProps>(
  ({ className, title = "Bring decisions into a harbor where routing and consequence are explicit", description, entries, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.95fr_0.8fr_1fr_0.8fr_0.9fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Decision</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Arrival</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Cargo</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Berth</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Departure</div>
            </div>
            <div className="divide-y divide-border">
              {entries.map((entry) => (
                <article key={entry.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.95fr_0.8fr_1fr_0.8fr_0.9fr] md:px-6">
                  <div className="text-sm font-medium">{entry.title}</div>
                  <div className="text-sm text-muted-foreground">{entry.arrival || "Arrival"}</div>
                  <div className="text-sm text-muted-foreground">{entry.cargo || "Cargo"}</div>
                  <div className="text-sm text-muted-foreground">{entry.berth || "Berth"}</div>
                  <div className="text-sm text-muted-foreground">{entry.departure || "Departure"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionHarbor.displayName = "LandingProductDecisionHarbor";