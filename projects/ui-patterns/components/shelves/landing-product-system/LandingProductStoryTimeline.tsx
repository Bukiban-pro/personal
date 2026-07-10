import { cn } from "@/lib/utils";
import * as React from "react";

export interface StoryStep {
  title: string;
  description?: string;
  accent?: string;
}

export interface LandingProductStoryTimelineProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  steps: StoryStep[];
}

export const LandingProductStoryTimeline = React.forwardRef<HTMLElement, LandingProductStoryTimelineProps>(
  ({ className, title, description, steps, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="relative space-y-4">
            <div className="absolute left-5 top-3 bottom-3 w-px bg-border" aria-hidden="true" />
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                    {step.accent ? <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{step.accent}</span> : null}
                  </div>
                  {step.description ? <p className="text-sm leading-6 text-muted-foreground">{step.description}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStoryTimeline.displayName = "LandingProductStoryTimeline";
