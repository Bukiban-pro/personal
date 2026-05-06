import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustFabricThread {
  title: string;
  anchor?: string;
  safeguard?: string;
  proof?: string;
}

export interface LandingProductTrustFabricProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  threads: TrustFabricThread[];
}

export const LandingProductTrustFabric = React.forwardRef<HTMLElement, LandingProductTrustFabricProps>(
  ({ className, title = "Show trust as a fabric of anchors, safeguards, and proof", description, threads, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {threads.map((thread) => (
              <article key={thread.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {thread.anchor ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{thread.anchor}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{thread.title}</h3>
                {thread.safeguard ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{thread.safeguard}</p> : null}
                {thread.proof ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{thread.proof}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustFabric.displayName = "LandingProductTrustFabric";