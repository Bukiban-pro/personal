import { cn } from "@/lib/utils";
import * as React from "react";

export interface CoordinationKernelThread {
  title: string;
  contract?: string;
  participants?: string[];
  escalation?: string;
}

export interface LandingProductCoordinationKernelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  threads: CoordinationKernelThread[];
}

export const LandingProductCoordinationKernel = React.forwardRef<HTMLElement, LandingProductCoordinationKernelProps>(
  ({ className, title = "Make coordination explicit through kernel-level contracts", description, threads, ...props }, ref) => {
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
                {thread.contract ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{thread.contract}</p> : null}
                {thread.participants?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {thread.participants.map((participant) => (
                      <span key={participant} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {participant}
                      </span>
                    ))}
                  </div>
                ) : null}
                {thread.escalation ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{thread.escalation}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCoordinationKernel.displayName = "LandingProductCoordinationKernel";