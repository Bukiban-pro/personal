import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustArchitectureLayer {
  title: string;
  control?: string;
  evidence?: string;
  audit?: string;
}

export interface LandingProductTrustArchitectureProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  layers: TrustArchitectureLayer[];
}

export const LandingProductTrustArchitecture = React.forwardRef<HTMLElement, LandingProductTrustArchitectureProps>(
  ({ className, title = "Render trust as an architecture, not a badge row", description, layers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_1fr_1fr_0.8fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Layer</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Control</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Evidence</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Audit</div>
            </div>
            <div className="divide-y divide-border">
              {layers.map((layer) => (
                <article key={layer.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_1fr_1fr_0.8fr] md:px-6">
                  <div className="text-sm font-medium">{layer.title}</div>
                  <div className="text-sm text-muted-foreground">{layer.control || "Preventive control"}</div>
                  <div className="text-sm text-muted-foreground">{layer.evidence || "Observable proof"}</div>
                  <div className="text-sm text-muted-foreground">{layer.audit || "Review path"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustArchitecture.displayName = "LandingProductTrustArchitecture";