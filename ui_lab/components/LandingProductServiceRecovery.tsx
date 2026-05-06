import { cn } from "@/lib/utils";
import * as React from "react";

export interface ServiceRecoveryStep {
  title: string;
  trigger?: string;
  response?: string;
  owner?: string;
}

export interface LandingProductServiceRecoveryProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  steps: ServiceRecoveryStep[];
}

export const LandingProductServiceRecovery = React.forwardRef<HTMLElement, LandingProductServiceRecoveryProps>(
  ({ className, title = "Show how the system recovers, not just how it works on a good day", description, steps, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold tracking-tight">Recovery {index + 1}</div>
                  {step.owner ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{step.owner}</div> : null}
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{step.title}</h3>
                {step.trigger ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.trigger}</p> : null}
                {step.response ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{step.response}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductServiceRecovery.displayName = "LandingProductServiceRecovery";