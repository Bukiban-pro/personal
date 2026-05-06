import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionArrayRow {
  title: string;
  option?: string;
  signal?: string;
  verdict?: string;
  owner?: string;
}

export interface LandingProductDecisionArrayProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: DecisionArrayRow[];
}

export const LandingProductDecisionArray = React.forwardRef<HTMLElement, LandingProductDecisionArrayProps>(
  ({ className, title = "Lay decisions out as an array so tradeoffs stop hiding in prose", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.95fr_0.9fr_0.95fr_0.95fr_0.8fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Decision</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Option</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Signal</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Verdict</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Owner</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.95fr_0.9fr_0.95fr_0.95fr_0.8fr] md:px-6">
                  <div className="text-sm font-medium">{row.title}</div>
                  <div className="text-sm text-muted-foreground">{row.option || "Option"}</div>
                  <div className="text-sm text-muted-foreground">{row.signal || "Signal"}</div>
                  <div className="text-sm text-muted-foreground">{row.verdict || "Verdict"}</div>
                  <div className="text-sm text-muted-foreground">{row.owner || "Owner"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionArray.displayName = "LandingProductDecisionArray";