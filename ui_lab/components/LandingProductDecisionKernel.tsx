import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionKernelPrimitive {
  title: string;
  rule?: string;
  evidence?: string;
  override?: string;
}

export interface LandingProductDecisionKernelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  primitives: DecisionKernelPrimitive[];
}

export const LandingProductDecisionKernel = React.forwardRef<HTMLElement, LandingProductDecisionKernelProps>(
  ({ className, title = "Reduce decisions to the kernel that actually governs them", description, primitives, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {primitives.map((primitive) => (
              <article key={primitive.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{primitive.title}</h3>
                {primitive.rule ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{primitive.rule}</p> : null}
                {primitive.evidence ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{primitive.evidence}</div> : null}
                {primitive.override ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{primitive.override}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionKernel.displayName = "LandingProductDecisionKernel";