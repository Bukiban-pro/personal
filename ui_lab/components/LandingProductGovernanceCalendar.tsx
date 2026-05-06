import { cn } from "@/lib/utils";
import * as React from "react";

export interface GovernanceCalendarEntry {
  title: string;
  cadence?: string;
  participants?: string;
  description?: string;
}

export interface LandingProductGovernanceCalendarProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  entries: GovernanceCalendarEntry[];
}

export const LandingProductGovernanceCalendar = React.forwardRef<
  HTMLElement,
  LandingProductGovernanceCalendarProps
>(({ className, title = "Turn governance into a visible operating calendar", description, entries, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {entries.map((entry) => (
            <article key={entry.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight">{entry.title}</h3>
                {entry.cadence ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.cadence}</div> : null}
              </div>
              {entry.participants ? <div className="mt-2 text-sm text-muted-foreground">{entry.participants}</div> : null}
              {entry.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductGovernanceCalendar.displayName = "LandingProductGovernanceCalendar";