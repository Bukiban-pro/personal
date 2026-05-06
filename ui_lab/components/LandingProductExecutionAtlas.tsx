import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExecutionAtlasZone {
  title: string;
  terrain?: string;
  dependency?: string;
  move?: string;
}

export interface LandingProductExecutionAtlasProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  zones: ExecutionAtlasZone[];
}

export const LandingProductExecutionAtlas = React.forwardRef<HTMLElement, LandingProductExecutionAtlasProps>(
  ({ className, title = "Map execution as terrain, dependencies, and moves", description, zones, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {zones.map((zone) => (
              <article key={zone.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {zone.terrain ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{zone.terrain}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{zone.title}</h3>
                {zone.dependency ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{zone.dependency}</p> : null}
                {zone.move ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{zone.move}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExecutionAtlas.displayName = "LandingProductExecutionAtlas";