import { cn } from "@/lib/utils";
import * as React from "react";

export interface GovernanceModelLayer {
  title: string;
  owner?: string;
  responsibilities: string[];
}

export interface LandingProductGovernanceModelProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  layers: GovernanceModelLayer[];
}

export const LandingProductGovernanceModel = React.forwardRef<
  HTMLElement,
  LandingProductGovernanceModelProps
>(({ className, title = "Define governance before scale introduces drift", description, layers, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {layers.map((layer) => (
            <article key={layer.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight">{layer.title}</h3>
                {layer.owner ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{layer.owner}</div> : null}
              </div>
              <ul className="mt-4 grid gap-2">
                {layer.responsibilities.map((item) => (
                  <li key={item} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductGovernanceModel.displayName = "LandingProductGovernanceModel";