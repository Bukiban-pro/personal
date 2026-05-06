import { cn } from "@/lib/utils";
import * as React from "react";

export interface TeamTopologyNode {
  title: string;
  interface?: string;
  metric?: string;
  description?: string;
}

export interface LandingProductTeamTopologyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  nodes: TeamTopologyNode[];
}

export const LandingProductTeamTopology = React.forwardRef<HTMLElement, LandingProductTeamTopologyProps>(
  ({ className, title = "Describe the team topology around delivery and ownership", description, nodes, ...props }, ref) => {
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
                <h3 className="text-base font-semibold tracking-tight">{node.title}</h3>
                {node.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{node.description}</p> : null}
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>{node.interface || "Interface"}</span>
                  <span>{node.metric || "Metric"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTeamTopology.displayName = "LandingProductTeamTopology";