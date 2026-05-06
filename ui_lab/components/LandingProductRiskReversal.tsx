import { cn } from "@/lib/utils";
import * as React from "react";

export interface GuaranteeItem {
  title: string;
  detail: string;
}

export interface LandingProductRiskReversalProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  guarantees: GuaranteeItem[];
  badge?: string;
}

export const LandingProductRiskReversal = React.forwardRef<
  HTMLElement,
  LandingProductRiskReversalProps
>(({ className, title = "Zero-risk adoption", description, guarantees, badge = "Guarantee", ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-border bg-card px-6 py-10 shadow-sm lg:px-10 lg:py-12">
        <div className="inline-flex w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {badge}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {guarantees.map((item) => (
            <article key={item.title} className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductRiskReversal.displayName = "LandingProductRiskReversal";
