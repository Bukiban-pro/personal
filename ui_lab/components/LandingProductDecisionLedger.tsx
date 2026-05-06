import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionLedgerEntry {
  title: string;
  status?: string;
  owner?: string;
  rationale?: string;
}

export interface LandingProductDecisionLedgerProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  entries: DecisionLedgerEntry[];
}

export const LandingProductDecisionLedger = React.forwardRef<HTMLElement, LandingProductDecisionLedgerProps>(
  ({ className, title = "Turn key decisions into a visible ledger", description, entries, ...props }, ref) => {
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
                  {entry.status ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.status}</div> : null}
                </div>
                {entry.owner ? <div className="mt-2 text-sm text-muted-foreground">{entry.owner}</div> : null}
                {entry.rationale ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.rationale}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionLedger.displayName = "LandingProductDecisionLedger";