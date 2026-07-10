import { cn } from "@/lib/utils";
import * as React from "react";

export interface ProcurementPackItem {
  title: string;
  description?: string;
  type?: string;
  readiness?: string;
}

export interface LandingProductProcurementPackProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  badge?: string;
  items: ProcurementPackItem[];
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export const LandingProductProcurementPack = React.forwardRef<
  HTMLElement,
  LandingProductProcurementPackProps
>(({ className, title = "Package procurement into one clear handoff", description, badge = "Procurement Pack", items, primaryAction, secondaryAction, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                {item.readiness ? (
                  <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {item.readiness}
                  </span>
                ) : null}
              </div>
              {item.type ? (
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.type}
                </div>
              ) : null}
              {item.description ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              ) : null}
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="inline-flex w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {badge}
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <div className="text-sm font-semibold tracking-tight">What the buyer gets</div>
            <div className="mt-2 text-sm leading-6 text-muted-foreground">
              A ready-to-forward packet for security, finance, procurement, and the implementation lead.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {primaryAction ? <div>{primaryAction}</div> : null}
            {secondaryAction ? <div>{secondaryAction}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductProcurementPack.displayName = "LandingProductProcurementPack";