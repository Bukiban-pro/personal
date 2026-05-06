import { cn } from "@/lib/utils";
import * as React from "react";

export interface EvidenceKernelModule {
  title: string;
  source?: string;
  reduction?: string;
  output?: string;
}

export interface LandingProductEvidenceKernelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  modules: EvidenceKernelModule[];
}

export const LandingProductEvidenceKernel = React.forwardRef<HTMLElement, LandingProductEvidenceKernelProps>(
  ({ className, title = "Reduce proof to its kernel before the story bloats", description, modules, ...props }, ref) => {
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
                {module.source ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{module.source}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{module.title}</h3>
                {module.reduction ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.reduction}</p> : null}
                {module.output ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{module.output}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductEvidenceKernel.displayName = "LandingProductEvidenceKernel";