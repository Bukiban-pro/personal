import { cn } from "@/lib/utils";
import * as React from "react";

export interface SLACommitmentItem {
  name: string;
  commitment: string;
  scope?: string;
  note?: string;
}

export interface LandingProductSLACommitmentsProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: SLACommitmentItem[];
}

export const LandingProductSLACommitments = React.forwardRef<
  HTMLElement,
  LandingProductSLACommitmentsProps
>(({ className, title = "Set SLA commitments before procurement asks twice", description, items, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">{item.name}</div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{item.commitment}</div>
              {item.scope ? <div className="mt-2 text-sm text-muted-foreground">{item.scope}</div> : null}
              {item.note ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.note}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductSLACommitments.displayName = "LandingProductSLACommitments";