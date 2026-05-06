import { cn } from "@/lib/utils";
import * as React from "react";

export interface OrgDesignRole {
  role: string;
  scope?: string;
  description?: string;
  metrics?: string[];
}

export interface LandingProductOrgDesignProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  roles: OrgDesignRole[];
}

export const LandingProductOrgDesign = React.forwardRef<HTMLElement, LandingProductOrgDesignProps>(
  ({ className, title = "Show the operating model behind the rollout", description, roles, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {roles.map((item) => (
              <article key={item.role} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {item.scope ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.scope}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{item.role}</h3>
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                {item.metrics?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.metrics.map((metric) => (
                      <span key={metric} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {metric}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOrgDesign.displayName = "LandingProductOrgDesign";