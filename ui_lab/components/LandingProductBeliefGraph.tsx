import { cn } from "@/lib/utils";
import * as React from "react";

export interface BeliefGraphNode {
  title: string;
  audience?: string;
  belief?: string;
  proof?: string;
  dependencies?: string[];
}

export interface LandingProductBeliefGraphProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: BeliefGraphNode[];
}

export const LandingProductBeliefGraph = React.forwardRef<HTMLElement, LandingProductBeliefGraphProps>(
  ({ className, title = "Map belief as a graph of proofs and dependencies", description, nodes, ...props }, ref) => {
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
                {node.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{node.audience}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{node.title}</h3>
                {node.belief ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.belief}</p> : null}
                {node.proof ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{node.proof}</div> : null}
                {node.dependencies?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {node.dependencies.map((dependency) => (
                      <span key={dependency} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {dependency}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBeliefGraph.displayName = "LandingProductBeliefGraph";