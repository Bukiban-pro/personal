import { cn } from "@/lib/utils";
import * as React from "react";

export interface MessageTopologyCluster {
  title: string;
  audience?: string;
  messages?: string[];
}

export interface LandingProductMessageTopologyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  clusters: MessageTopologyCluster[];
}

export const LandingProductMessageTopology = React.forwardRef<HTMLElement, LandingProductMessageTopologyProps>(
  ({ className, title = "Arrange message topology by audience and emphasis", description, clusters, ...props }, ref) => {
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
                {cluster.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{cluster.audience}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{cluster.title}</h3>
                <div className="mt-4 grid gap-2">
                  {cluster.messages?.map((message) => (
                    <div key={message} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {message}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductMessageTopology.displayName = "LandingProductMessageTopology";