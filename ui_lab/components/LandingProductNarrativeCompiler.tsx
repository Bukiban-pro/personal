import { cn } from "@/lib/utils";
import * as React from "react";

export interface NarrativeCompilerStage {
  title: string;
  source?: string;
  transform?: string;
  artifact?: string;
  note?: string;
}

export interface LandingProductNarrativeCompilerProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: NarrativeCompilerStage[];
}

export const LandingProductNarrativeCompiler = React.forwardRef<HTMLElement, LandingProductNarrativeCompilerProps>(
  ({ className, title = "Compile raw product truth into a sharper narrative artifact", description, stages, ...props }, ref) => {
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
                <div className="text-sm font-semibold tracking-tight">Stage {index + 1}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{stage.title}</h3>
                {stage.source ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.source}</p> : null}
                {stage.transform ? <div className="mt-4 text-sm font-medium text-foreground">{stage.transform}</div> : null}
                {stage.artifact ? <div className="mt-2 text-sm text-muted-foreground">{stage.artifact}</div> : null}
                {stage.note ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{stage.note}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductNarrativeCompiler.displayName = "LandingProductNarrativeCompiler";