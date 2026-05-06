import { cn } from "@/lib/utils";
import * as React from "react";

export interface ValueMeshNode {
  title: string;
  source?: string;
  flow?: string;
  proof?: string;
  connection?: string;
}

export interface LandingProductValueMeshProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: ValueMeshNode[];
}

export const LandingProductValueMesh = React.forwardRef<HTMLElement, LandingProductValueMeshProps>(
  ({ className, title = "Show value as a mesh of flows, proof, and dependency", description, nodes, ...props }, ref) => {
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
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{node.source || "Source"}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{node.title}</h3>
                {node.flow ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.flow}</p> : null}
                {node.proof ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{node.proof}</div> : null}
                {node.connection ? <div className="mt-2 text-sm text-muted-foreground">{node.connection}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductValueMesh.displayName = "LandingProductValueMesh";