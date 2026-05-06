import { cn } from "@/lib/utils";
import * as React from "react";

export interface BeliefCompilerStage {
  title: string;
  input?: string;
  synthesis?: string;
  output?: string;
  pressure?: string;
}

export interface LandingProductBeliefCompilerProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: BeliefCompilerStage[];
}

export const LandingProductBeliefCompiler = React.forwardRef<HTMLElement, LandingProductBeliefCompilerProps>(
  ({ className, title = "Compile fragmented belief into a single defensible stance", description, stages, ...props }, ref) => {
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
                <div className="text-sm font-semibold tracking-tight">Pass {index + 1}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{stage.title}</h3>
                {stage.input ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.input}</p> : null}
                {stage.synthesis ? <div className="mt-4 text-sm font-medium text-foreground">{stage.synthesis}</div> : null}
                {stage.output ? <div className="mt-2 text-sm text-muted-foreground">{stage.output}</div> : null}
                {stage.pressure ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{stage.pressure}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBeliefCompiler.displayName = "LandingProductBeliefCompiler";