import { cn } from "@/lib/utils";
import * as React from "react";

export interface ReferenceWorkflowStage {
  title: string;
  trigger?: string;
  asset?: string;
  description?: string;
}

export interface LandingProductReferenceWorkflowProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: ReferenceWorkflowStage[];
}

export const LandingProductReferenceWorkflow = React.forwardRef<
  HTMLElement,
  LandingProductReferenceWorkflowProps
>(({ className, title = "Systematize how references are sourced and reused", description, stages, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <article key={stage.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold tracking-tight">Step {index + 1}</div>
                {stage.trigger ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stage.trigger}</div> : null}
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{stage.title}</h3>
              {stage.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.description}</p> : null}
              {stage.asset ? <div className="mt-4 text-sm font-medium text-foreground">{stage.asset}</div> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductReferenceWorkflow.displayName = "LandingProductReferenceWorkflow";