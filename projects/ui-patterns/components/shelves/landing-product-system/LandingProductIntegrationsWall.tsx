import { cn } from "@/lib/utils";
import * as React from "react";

export interface IntegrationItem {
  name: string;
  category?: string;
  logo?: React.ReactNode;
}

export interface LandingProductIntegrationsWallProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  integrations: IntegrationItem[];
}

export const LandingProductIntegrationsWall = React.forwardRef<
  HTMLElement,
  LandingProductIntegrationsWallProps
>(({ className, title = "Works with your stack", description, integrations, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                {integration.logo || <span className="text-xs font-semibold">{integration.name.slice(0, 2)}</span>}
              </div>
              <div>
                <div className="text-sm font-semibold">{integration.name}</div>
                {integration.category ? (
                  <div className="text-xs text-muted-foreground">{integration.category}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductIntegrationsWall.displayName = "LandingProductIntegrationsWall";
