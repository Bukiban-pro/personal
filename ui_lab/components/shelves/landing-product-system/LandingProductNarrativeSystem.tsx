import { cn } from "@/lib/utils";
import * as React from "react";

export interface NarrativeSystemModule {
  title: string;
  input?: string;
  transformation?: string;
  output?: string;
}

export interface LandingProductNarrativeSystemProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  modules: NarrativeSystemModule[];
}

export const LandingProductNarrativeSystem = React.forwardRef<HTMLElement, LandingProductNarrativeSystemProps>(
  ({ className, title = "Treat the narrative as a system that processes belief", description, modules, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {modules.map((module) => (
              <article key={module.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{module.title}</h3>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Input</div>
                    <div className="mt-2 text-sm font-medium">{module.input || "Input"}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-primary/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Transformation</div>
                    <div className="mt-2 text-sm font-medium">{module.transformation || "Transformation"}</div>
                  </div>
                </div>
                {module.output ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{module.output}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductNarrativeSystem.displayName = "LandingProductNarrativeSystem";