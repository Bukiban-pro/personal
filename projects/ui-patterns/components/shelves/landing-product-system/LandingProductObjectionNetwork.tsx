import { cn } from "@/lib/utils";
import * as React from "react";

export interface ObjectionNetworkNode {
  title: string;
  stakeholder?: string;
  dependency?: string;
  rebuttal?: string;
}

export interface LandingProductObjectionNetworkProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: ObjectionNetworkNode[];
}

export const LandingProductObjectionNetwork = React.forwardRef<HTMLElement, LandingProductObjectionNetworkProps>(
  ({ className, title = "Map objections as a network of dependencies and answers", description, nodes, ...props }, ref) => {
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
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{node.stakeholder || "Stakeholder"}</span>
                  <span>{node.dependency || "Dependency"}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{node.title}</h3>
                {node.rebuttal ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.rebuttal}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductObjectionNetwork.displayName = "LandingProductObjectionNetwork";