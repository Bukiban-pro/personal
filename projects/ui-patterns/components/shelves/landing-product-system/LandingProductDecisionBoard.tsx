import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionBoardCriterion {
  label: string;
  owner: string;
  confidence?: string;
  note?: string;
}

export interface LandingProductDecisionBoardProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  criteria: DecisionBoardCriterion[];
}

export const LandingProductDecisionBoard = React.forwardRef<
  HTMLElement,
  LandingProductDecisionBoardProps
>(({ className, title = "Make the final decision board easier to read", description, criteria, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1fr_0.8fr_0.8fr]">
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Criteria</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Owner</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Confidence</div>
          </div>

          <div className="divide-y divide-border">
            {criteria.map((criterion) => (
              <article key={criterion.label} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_0.8fr_0.8fr] md:px-6">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{criterion.label}</h3>
                  {criterion.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{criterion.note}</p> : null}
                </div>
                <div className="text-sm text-muted-foreground">{criterion.owner}</div>
                <div className="text-sm text-muted-foreground">{criterion.confidence || "In review"}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductDecisionBoard.displayName = "LandingProductDecisionBoard";