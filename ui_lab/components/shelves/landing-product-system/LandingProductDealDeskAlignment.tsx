import { cn } from "@/lib/utils";
import * as React from "react";

export interface DealDeskAlignmentItem {
  stage: string;
  owner?: string;
  output?: string;
  detail?: string;
}

export interface LandingProductDealDeskAlignmentProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: DealDeskAlignmentItem[];
}

export const LandingProductDealDeskAlignment = React.forwardRef<
  HTMLElement,
  LandingProductDealDeskAlignmentProps
>(({ className, title = "Make deal desk alignment visible before approvals slip", description, items, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.8fr_0.8fr_0.8fr_1.2fr]">
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Stage</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Owner</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Output</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Detail</div>
          </div>
          <div className="divide-y divide-border">
            {items.map((item) => (
              <article key={item.stage} className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_0.8fr_0.8fr_1.2fr] md:px-6">
                <div className="text-sm font-medium">{item.stage}</div>
                <div className="text-sm text-muted-foreground">{item.owner || "Shared"}</div>
                <div className="text-sm text-muted-foreground">{item.output || "Review packet"}</div>
                <div className="text-sm text-muted-foreground">{item.detail || "Approval flow"}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductDealDeskAlignment.displayName = "LandingProductDealDeskAlignment";