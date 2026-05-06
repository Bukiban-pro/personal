import { cn } from "@/lib/utils";
import * as React from "react";

export interface PartnerLaunchStep {
  title: string;
  duration?: string;
  owner?: string;
  description?: string;
  deliverables?: string[];
}

export interface LandingProductPartnerLaunchPlanProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  steps: PartnerLaunchStep[];
}

export const LandingProductPartnerLaunchPlan = React.forwardRef<
  HTMLElement,
  LandingProductPartnerLaunchPlanProps
>(({ className, title = "Give partners a launch plan they can actually execute", description, steps, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {step.duration ? <div>{step.duration}</div> : null}
                  {step.owner ? <div className="mt-1">{step.owner}</div> : null}
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{step.title}</h3>
              {step.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p> : null}
              {step.deliverables?.length ? (
                <ul className="mt-4 grid gap-2">
                  {step.deliverables.map((deliverable) => (
                    <li key={deliverable} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {deliverable}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductPartnerLaunchPlan.displayName = "LandingProductPartnerLaunchPlan";