import { cn } from "@/lib/utils";
import * as React from "react";

export interface InfluenceCouncilMotion {
  title: string;
  sponsor?: string;
  coalition?: string;
  resistance?: string;
  nextMove?: string;
}

export interface LandingProductInfluenceCouncilProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  motions: InfluenceCouncilMotion[];
}

export const LandingProductInfluenceCouncil = React.forwardRef<HTMLElement, LandingProductInfluenceCouncilProps>(
  ({ className, title = "Model influence as a council of sponsors, coalitions, and resistance", description, motions, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.95fr_0.85fr_0.95fr_1fr_0.95fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Motion</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Sponsor</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Coalition</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Resistance</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Next Move</div>
            </div>
            <div className="divide-y divide-border">
              {motions.map((motion) => (
                <article key={motion.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.95fr_0.85fr_0.95fr_1fr_0.95fr] md:px-6">
                  <div className="text-sm font-medium">{motion.title}</div>
                  <div className="text-sm text-muted-foreground">{motion.sponsor || "Sponsor"}</div>
                  <div className="text-sm text-muted-foreground">{motion.coalition || "Coalition"}</div>
                  <div className="text-sm text-muted-foreground">{motion.resistance || "Resistance"}</div>
                  <div className="text-sm text-muted-foreground">{motion.nextMove || "Next Move"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductInfluenceCouncil.displayName = "LandingProductInfluenceCouncil";