import { cn } from "@/lib/utils";
import * as React from "react";

export interface ConfidenceMeshNode {
  title: string;
  source?: string;
  confidence?: string;
  proof?: string;
}

export interface LandingProductConfidenceMeshProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: ConfidenceMeshNode[];
}

export const LandingProductConfidenceMesh = React.forwardRef<HTMLElement, LandingProductConfidenceMeshProps>(
  ({ className, title = "Show confidence as a mesh of signals and proof", description, nodes, ...props }, ref) => {
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
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{node.source || "Source"}</span>
                  <span>{node.confidence || "Confidence"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{node.title}</h3>
                {node.proof ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.proof}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductConfidenceMesh.displayName = "LandingProductConfidenceMesh";