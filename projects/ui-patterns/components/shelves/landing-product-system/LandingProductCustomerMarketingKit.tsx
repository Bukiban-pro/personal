import { cn } from "@/lib/utils";
import * as React from "react";

export interface CustomerMarketingAsset {
  title: string;
  format?: string;
  description?: string;
  objective?: string;
}

export interface LandingProductCustomerMarketingKitProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  assets: CustomerMarketingAsset[];
}

export const LandingProductCustomerMarketingKit = React.forwardRef<
  HTMLElement,
  LandingProductCustomerMarketingKitProps
>(({ className, title = "Turn customer wins into repeatable marketing assets", description, assets, ...props }, ref) => {
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
              {asset.format ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{asset.format}</div> : null}
              <h3 className="mt-3 text-base font-semibold tracking-tight">{asset.title}</h3>
              {asset.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{asset.description}</p> : null}
              {asset.objective ? <div className="mt-4 text-sm font-medium text-foreground">{asset.objective}</div> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductCustomerMarketingKit.displayName = "LandingProductCustomerMarketingKit";