import { cn } from "@/lib/utils";
import * as React from "react";

export interface AccountExpansionPath {
  title: string;
  targetTeam?: string;
  trigger?: string;
  description?: string;
}

export interface LandingProductAccountExpansionMapProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  paths: AccountExpansionPath[];
}

export const LandingProductAccountExpansionMap = React.forwardRef<
  HTMLElement,
  LandingProductAccountExpansionMapProps
>(({ className, title = "Map the next expansion motion before the first one lands", description, paths, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {paths.map((path) => (
            <article key={path.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span>{path.targetTeam || "Target team"}</span>
                <span>{path.trigger || "Expansion trigger"}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{path.title}</h3>
              {path.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{path.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductAccountExpansionMap.displayName = "LandingProductAccountExpansionMap";