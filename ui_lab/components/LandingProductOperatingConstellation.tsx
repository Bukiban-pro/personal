import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingConstellationNode {
  title: string;
  cluster?: string;
  responsibility?: string;
  signal?: string;
  handoff?: string;
}

export interface LandingProductOperatingConstellationProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: OperatingConstellationNode[];
}

export const LandingProductOperatingConstellation = React.forwardRef<HTMLElement, LandingProductOperatingConstellationProps>(
  ({ className, title = "Map the operating model as a constellation of dependent stars", description, nodes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {nodes.map((node) => (
              <article key={node.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{node.cluster || "Cluster"}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{node.title}</h3>
                {node.responsibility ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.responsibility}</p> : null}
                {node.signal ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{node.signal}</div> : null}
                {node.handoff ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{node.handoff}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperatingConstellation.displayName = "LandingProductOperatingConstellation";