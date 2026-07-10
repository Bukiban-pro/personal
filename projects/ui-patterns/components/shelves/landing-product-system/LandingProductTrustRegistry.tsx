import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustRegistryEntry {
  title: string;
  domain?: string;
  standard?: string;
  owner?: string;
  renewal?: string;
}

export interface LandingProductTrustRegistryProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  entries: TrustRegistryEntry[];
}

export const LandingProductTrustRegistry = React.forwardRef<HTMLElement, LandingProductTrustRegistryProps>(
  ({ className, title = "Register trust commitments as a living system of standards and renewals", description, entries, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.95fr_0.9fr_0.95fr_0.8fr_0.9fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Entry</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Domain</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Standard</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Owner</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Renewal</div>
            </div>
            <div className="divide-y divide-border">
              {entries.map((entry) => (
                <article key={entry.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.95fr_0.9fr_0.95fr_0.8fr_0.9fr] md:px-6">
                  <div className="text-sm font-medium">{entry.title}</div>
                  <div className="text-sm text-muted-foreground">{entry.domain || "Domain"}</div>
                  <div className="text-sm text-muted-foreground">{entry.standard || "Standard"}</div>
                  <div className="text-sm text-muted-foreground">{entry.owner || "Owner"}</div>
                  <div className="text-sm text-muted-foreground">{entry.renewal || "Renewal"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustRegistry.displayName = "LandingProductTrustRegistry";