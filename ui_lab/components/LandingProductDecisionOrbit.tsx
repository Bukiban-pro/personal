import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionOrbitNode {
  title: string;
  force?: string;
  tradeoff?: string;
  move?: string;
}

export interface LandingProductDecisionOrbitProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: DecisionOrbitNode[];
}

export const LandingProductDecisionOrbit = React.forwardRef<HTMLElement, LandingProductDecisionOrbitProps>(
  ({ className, title = "Organize decisions as an orbit of forces and moves", description, nodes, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeNode = nodes.length > 0 ? nodes[Math.min(activeIndex, nodes.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {nodes.map((node, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(nodes.length - 1, 0));

                return (
                  <button
                    key={node.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{node.title}</div>
                    {node.force ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.force}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeNode ? (
                <>
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{activeNode.title}</h3>
                  {activeNode.force ? <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{activeNode.force}</p> : null}
                  {activeNode.tradeoff ? <div className="mt-6 rounded-2xl border border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground">{activeNode.tradeoff}</div> : null}
                  {activeNode.move ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeNode.move}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add orbit nodes to populate the decision view.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionOrbit.displayName = "LandingProductDecisionOrbit";