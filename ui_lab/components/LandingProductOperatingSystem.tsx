import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingSystemDomain {
  title: string;
  purpose?: string;
  mechanism?: string;
  outcome?: string;
}

export interface LandingProductOperatingSystemProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  domains: OperatingSystemDomain[];
}

export const LandingProductOperatingSystem = React.forwardRef<HTMLElement, LandingProductOperatingSystemProps>(
  ({ className, title = "Describe the product as an operating system for coordinated work", description, domains, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {domains.map((domain) => (
              <article key={domain.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{domain.title}</h3>
                {domain.purpose ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{domain.purpose}</p> : null}
                {domain.mechanism ? <div className="mt-4 text-sm font-medium text-foreground">{domain.mechanism}</div> : null}
                {domain.outcome ? <div className="mt-2 text-sm text-muted-foreground">{domain.outcome}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperatingSystem.displayName = "LandingProductOperatingSystem";