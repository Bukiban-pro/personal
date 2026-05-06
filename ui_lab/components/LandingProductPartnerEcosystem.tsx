import { cn } from "@/lib/utils";
import * as React from "react";

export interface PartnerEcosystemItem {
  name: string;
  type?: string;
  description?: string;
  motion?: string;
}

export interface LandingProductPartnerEcosystemProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  partners: PartnerEcosystemItem[];
}

export const LandingProductPartnerEcosystem = React.forwardRef<
  HTMLElement,
  LandingProductPartnerEcosystemProps
>(({ className, title = "Show how the product fits the partner ecosystem", description, partners, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {partners.map((partner) => (
            <article key={partner.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight">{partner.name}</h3>
                {partner.type ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{partner.type}</div> : null}
              </div>
              {partner.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{partner.description}</p> : null}
              {partner.motion ? <div className="mt-4 text-sm font-medium text-foreground">{partner.motion}</div> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductPartnerEcosystem.displayName = "LandingProductPartnerEcosystem";