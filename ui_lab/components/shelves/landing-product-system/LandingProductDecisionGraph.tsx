import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionGraphNode {
  title: string;
  upstream?: string;
  downstream?: string;
  rule?: string;
}

export interface LandingProductDecisionGraphProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: DecisionGraphNode[];
}

export const LandingProductDecisionGraph = React.forwardRef<HTMLElement, LandingProductDecisionGraphProps>(
  ({ className, title = "Expose decision flow as a graph of rules and dependencies", description, nodes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {nodes.map((node) => (
              <article key={node.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{node.title}</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Upstream</div>
                    <div className="mt-2 text-sm font-medium">{node.upstream || "Input"}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-primary/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Downstream</div>
                    <div className="mt-2 text-sm font-medium">{node.downstream || "Effect"}</div>
                  </div>
                </div>
                {node.rule ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{node.rule}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionGraph.displayName = "LandingProductDecisionGraph";