import { cn } from "@/lib/utils";
import * as React from "react";

export interface ValueTopologyCluster {
  title: string;
  origin?: string;
  transfer?: string;
  proof?: string;
}

export interface LandingProductValueTopologyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  clusters: ValueTopologyCluster[];
}

export const LandingProductValueTopology = React.forwardRef<HTMLElement, LandingProductValueTopologyProps>(
  ({ className, title = "Show value topology as transfer, compounding, and proof", description, clusters, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <article key={cluster.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{cluster.title}</h3>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Origin</div>
                    <div className="mt-2 text-sm font-medium">{cluster.origin || "Primary input"}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-primary/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Transfer</div>
                    <div className="mt-2 text-sm font-medium">{cluster.transfer || "Transformation"}</div>
                  </div>
                  {cluster.proof ? <p className="text-sm leading-6 text-muted-foreground">{cluster.proof}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductValueTopology.displayName = "LandingProductValueTopology";