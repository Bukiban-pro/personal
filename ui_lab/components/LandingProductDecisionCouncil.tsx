import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionCouncilMotion {
  title: string;
  sponsor?: string;
  evidence?: string;
  objection?: string;
  vote?: string;
}

export interface LandingProductDecisionCouncilProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  motions: DecisionCouncilMotion[];
}

export const LandingProductDecisionCouncil = React.forwardRef<HTMLElement, LandingProductDecisionCouncilProps>(
  ({ className, title = "Bring major decisions into a council with sponsors, objections, and votes", description, motions, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_0.85fr_1fr_1fr_0.75fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Motion</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Sponsor</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Evidence</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Objection</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Vote</div>
            </div>
            <div className="divide-y divide-border">
              {motions.map((motion) => (
                <article key={motion.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_0.85fr_1fr_1fr_0.75fr] md:px-6">
                  <div className="text-sm font-medium">{motion.title}</div>
                  <div className="text-sm text-muted-foreground">{motion.sponsor || "Sponsor"}</div>
                  <div className="text-sm text-muted-foreground">{motion.evidence || "Evidence"}</div>
                  <div className="text-sm text-muted-foreground">{motion.objection || "Objection"}</div>
                  <div className="text-sm text-muted-foreground">{motion.vote || "Vote"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionCouncil.displayName = "LandingProductDecisionCouncil";