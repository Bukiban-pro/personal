import { cn } from "@/lib/utils";
import * as React from "react";

export interface ImplementationRiskItem {
  risk: string;
  severity?: string;
  mitigation: string;
  owner?: string;
}

export interface LandingProductImplementationRisksProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  risks: ImplementationRiskItem[];
}

export const LandingProductImplementationRisks = React.forwardRef<HTMLElement, LandingProductImplementationRisksProps>(
  ({ className, title = "Address implementation risks before they become objections", description, risks, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4">
            {risks.map((item) => (
              <article key={item.risk} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-base font-semibold tracking-tight">{item.risk}</h3>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.severity ? <span>{item.severity}</span> : null}
                    {item.owner ? <span>{item.owner}</span> : null}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.mitigation}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductImplementationRisks.displayName = "LandingProductImplementationRisks";