import { cn } from "@/lib/utils";
import * as React from "react";

export interface ImplementationTimelineStage {
  title: string;
  timeframe: string;
  owner?: string;
  description?: string;
  deliverables?: string[];
}

export interface LandingProductImplementationTimelineProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: ImplementationTimelineStage[];
}

export const LandingProductImplementationTimeline = React.forwardRef<
  HTMLElement,
  LandingProductImplementationTimelineProps
>(({ className, title = "Implementation timeline buyers can trust", description, stages, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid gap-0 border-b border-border bg-muted/40 px-5 py-4 text-sm md:grid-cols-[1.1fr_0.7fr_0.7fr] md:px-6">
            <div className="font-semibold text-foreground">Stage</div>
            <div className="font-semibold text-foreground">Timeframe</div>
            <div className="font-semibold text-foreground">Owner</div>
          </div>

          <div className="divide-y divide-border">
            {stages.map((stage) => (
              <article key={`${stage.title}-${stage.timeframe}`} className="grid gap-4 px-5 py-5 md:grid-cols-[1.1fr_0.7fr_0.7fr] md:px-6">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{stage.title}</h3>
                  {stage.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.description}</p>
                  ) : null}
                  {stage.deliverables?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stage.deliverables.map((deliverable) => (
                        <span
                          key={deliverable}
                          className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="text-sm font-medium text-foreground">{stage.timeframe}</div>
                <div className="text-sm text-muted-foreground">{stage.owner || "Shared"}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductImplementationTimeline.displayName = "LandingProductImplementationTimeline";