import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionStackLayer {
  title: string;
  question?: string;
  owner?: string;
  instrument?: string;
}

export interface LandingProductDecisionStackProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  layers: DecisionStackLayer[];
}

export const LandingProductDecisionStack = React.forwardRef<HTMLElement, LandingProductDecisionStackProps>(
  ({ className, title = "Layer decisions so strategic and tactical calls stop colliding", description, layers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {layers.map((layer) => (
              <article key={layer.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{layer.title}</h3>
                {layer.question ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{layer.question}</p> : null}
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>{layer.owner || "Owner"}</span>
                  <span>{layer.instrument || "Instrument"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionStack.displayName = "LandingProductDecisionStack";