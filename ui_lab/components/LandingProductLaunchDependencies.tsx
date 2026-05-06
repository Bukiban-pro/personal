import { cn } from "@/lib/utils";
import * as React from "react";

export interface LaunchDependencyItem {
  title: string;
  owner?: string;
  timing?: string;
  unblock?: string;
}

export interface LandingProductLaunchDependenciesProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: LaunchDependencyItem[];
}

export const LandingProductLaunchDependencies = React.forwardRef<HTMLElement, LandingProductLaunchDependenciesProps>(
  ({ className, title = "Make launch dependencies explicit before they become excuses", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                  {item.timing ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.timing}</div> : null}
                </div>
                {item.owner ? <div className="mt-2 text-sm text-muted-foreground">{item.owner}</div> : null}
                {item.unblock ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.unblock}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductLaunchDependencies.displayName = "LandingProductLaunchDependencies";