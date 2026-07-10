import { cn } from "@/lib/utils";
import * as React from "react";

export interface InternalCommsAsset {
  title: string;
  format?: string;
  audience?: string;
  description?: string;
}

export interface LandingProductInternalCommsKitProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  assets: InternalCommsAsset[];
}

export const LandingProductInternalCommsKit = React.forwardRef<HTMLElement, LandingProductInternalCommsKitProps>(
  ({ className, title = "Equip internal communications before rollout starts", description, assets, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assets.map((asset) => (
              <article key={asset.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  {asset.format ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{asset.format}</div> : <div />}
                  {asset.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{asset.audience}</div> : null}
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{asset.title}</h3>
                {asset.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{asset.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductInternalCommsKit.displayName = "LandingProductInternalCommsKit";