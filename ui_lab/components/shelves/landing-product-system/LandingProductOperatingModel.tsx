import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingModelLayer {
  title: string;
  scope?: string;
  description?: string;
  mechanics?: string[];
}

export interface LandingProductOperatingModelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  layers: OperatingModelLayer[];
}

export const LandingProductOperatingModel = React.forwardRef<HTMLElement, LandingProductOperatingModelProps>(
  ({ className, title = "Show the operating model behind the promise", description, layers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {layers.map((layer) => (
              <article key={layer.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {layer.scope ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{layer.scope}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{layer.title}</h3>
                {layer.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{layer.description}</p> : null}
                {layer.mechanics?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {layer.mechanics.map((mechanic) => (
                      <span key={mechanic} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {mechanic}
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

LandingProductOperatingModel.displayName = "LandingProductOperatingModel";