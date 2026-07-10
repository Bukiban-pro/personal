import { cn } from "@/lib/utils";
import * as React from "react";

export interface ConstraintAtlasRegion {
  title: string;
  terrain?: string;
  constraint?: string;
  relief?: string;
}

export interface LandingProductConstraintAtlasProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  regions: ConstraintAtlasRegion[];
}

export const LandingProductConstraintAtlas = React.forwardRef<HTMLElement, LandingProductConstraintAtlasProps>(
  ({ className, title = "Map the terrain of constraint instead of pretending friction is random", description, regions, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {regions.map((region) => (
              <article key={region.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {region.terrain ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{region.terrain}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{region.title}</h3>
                {region.constraint ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{region.constraint}</p> : null}
                {region.relief ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{region.relief}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductConstraintAtlas.displayName = "LandingProductConstraintAtlas";