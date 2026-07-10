import { cn } from "@/lib/utils";
import * as React from "react";

export interface IntegrationReadinessItem {
  title: string;
  protocol?: string;
  status?: string;
  description?: string;
}

export interface LandingProductIntegrationReadinessProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: IntegrationReadinessItem[];
}

export const LandingProductIntegrationReadiness = React.forwardRef<HTMLElement, LandingProductIntegrationReadinessProps>(
  ({ className, title = "Make integration readiness visible before technical review", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                  <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.protocol ? <div>{item.protocol}</div> : null}
                    {item.status ? <div className="mt-1">{item.status}</div> : null}
                  </div>
                </div>
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductIntegrationReadiness.displayName = "LandingProductIntegrationReadiness";