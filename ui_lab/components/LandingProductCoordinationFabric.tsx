import { cn } from "@/lib/utils";
import * as React from "react";

export interface CoordinationFabricThread {
  title: string;
  participants?: string[];
  contract?: string;
  path?: string;
  safeguard?: string;
}

export interface LandingProductCoordinationFabricProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  threads: CoordinationFabricThread[];
}

export const LandingProductCoordinationFabric = React.forwardRef<HTMLElement, LandingProductCoordinationFabricProps>(
  ({ className, title = "Show coordination as a fabric of contracts and safe handoffs", description, threads, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {threads.map((thread) => (
              <article key={thread.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{thread.title}</h3>
                {thread.participants?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {thread.participants.map((participant) => (
                      <span key={participant} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {participant}
                      </span>
                    ))}
                  </div>
                ) : null}
                {thread.contract ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{thread.contract}</p> : null}
                {thread.path ? <div className="mt-4 text-sm font-medium text-foreground">{thread.path}</div> : null}
                {thread.safeguard ? <div className="mt-2 text-sm text-muted-foreground">{thread.safeguard}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCoordinationFabric.displayName = "LandingProductCoordinationFabric";