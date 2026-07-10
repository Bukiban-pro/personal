import { cn } from "@/lib/utils";
import * as React from "react";

export interface EscalationPathItem {
  severity: string;
  owner?: string;
  response?: string;
  description?: string;
}

export interface LandingProductEscalationPathsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  paths: EscalationPathItem[];
}

export const LandingProductEscalationPaths = React.forwardRef<HTMLElement, LandingProductEscalationPathsProps>(
  ({ className, title = "Show how escalations move before trust is tested", description, paths, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {paths.map((item) => (
              <article key={item.severity} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{item.severity}</h3>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {item.owner ? <div>Owner: {item.owner}</div> : null}
                  {item.response ? <div>Response: {item.response}</div> : null}
                </div>
                {item.description ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductEscalationPaths.displayName = "LandingProductEscalationPaths";