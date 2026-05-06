import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExecutionFlywheelStage {
  title: string;
  input?: string;
  output?: string;
  signal?: string;
}

export interface LandingProductExecutionFlywheelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: ExecutionFlywheelStage[];
}

export const LandingProductExecutionFlywheel = React.forwardRef<HTMLElement, LandingProductExecutionFlywheelProps>(
  ({ className, title = "Show execution as a flywheel with visible signals", description, stages, ...props }, ref) => {
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
                <div className="text-sm font-semibold tracking-tight">Loop {index + 1}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{stage.title}</h3>
                <div className="mt-4 grid gap-3">
                  {stage.input ? <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{stage.input}</div> : null}
                  {stage.output ? <div className="rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm text-muted-foreground">{stage.output}</div> : null}
                  {stage.signal ? <div className="text-sm font-medium text-foreground">{stage.signal}</div> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExecutionFlywheel.displayName = "LandingProductExecutionFlywheel";