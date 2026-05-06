import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionSwitchyardRoute {
  title: string;
  trigger?: string;
  routing?: string;
  branch?: string;
  dispatch?: string;
}

export interface LandingProductDecisionSwitchyardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  routes: DecisionSwitchyardRoute[];
}

export const LandingProductDecisionSwitchyard = React.forwardRef<HTMLElement, LandingProductDecisionSwitchyardProps>(
  ({ className, title = "Route decisions through a switchyard instead of a black box", description, routes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_0.85fr_1fr_0.9fr_0.9fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Route</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Trigger</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Routing Logic</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Branch</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Dispatch</div>
            </div>
            <div className="divide-y divide-border">
              {routes.map((route) => (
                <article key={route.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_0.85fr_1fr_0.9fr_0.9fr] md:px-6">
                  <div className="text-sm font-medium">{route.title}</div>
                  <div className="text-sm text-muted-foreground">{route.trigger || "Trigger"}</div>
                  <div className="text-sm text-muted-foreground">{route.routing || "Routing Logic"}</div>
                  <div className="text-sm text-muted-foreground">{route.branch || "Branch"}</div>
                  <div className="text-sm text-muted-foreground">{route.dispatch || "Dispatch"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionSwitchyard.displayName = "LandingProductDecisionSwitchyard";