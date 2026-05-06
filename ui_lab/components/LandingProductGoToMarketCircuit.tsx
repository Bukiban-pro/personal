import { cn } from "@/lib/utils";
import * as React from "react";

export interface GoToMarketCircuitNode {
  title: string;
  signal?: string;
  team?: string;
  handoff?: string;
}

export interface LandingProductGoToMarketCircuitProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: GoToMarketCircuitNode[];
}

export const LandingProductGoToMarketCircuit = React.forwardRef<HTMLElement, LandingProductGoToMarketCircuitProps>(
  ({ className, title = "Make go-to-market feel like a circuit of signals and handoffs", description, nodes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {nodes.map((node) => (
              <article key={node.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{node.signal || "Signal"}</span>
                  <span>{node.team || "Team"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{node.title}</h3>
                {node.handoff ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.handoff}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductGoToMarketCircuit.displayName = "LandingProductGoToMarketCircuit";