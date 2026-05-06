import { cn } from "@/lib/utils";
import * as React from "react";

export interface ChangeStoryStage {
  title: string;
  from?: string;
  to?: string;
  proof?: string;
}

export interface LandingProductChangeStoryProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: ChangeStoryStage[];
}

export const LandingProductChangeStory = React.forwardRef<HTMLElement, LandingProductChangeStoryProps>(
  ({ className, title = "Tell the change story as a progression with proof", description, stages, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {stages.map((stage, index) => (
              <article key={stage.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-sm font-semibold tracking-tight">Phase {index + 1}</div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{stage.title}</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">From</div>
                    <div className="mt-2 text-sm font-medium">{stage.from || "Current state"}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-primary/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">To</div>
                    <div className="mt-2 text-sm font-medium">{stage.to || "Target state"}</div>
                  </div>
                </div>
                {stage.proof ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{stage.proof}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductChangeStory.displayName = "LandingProductChangeStory";