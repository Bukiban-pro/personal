import { cn } from "@/lib/utils";
import * as React from "react";

export interface DeliveryCapacityItem {
  title: string;
  capacity: string;
  coverage?: string;
  bottleneck?: string;
}

export interface LandingProductDeliveryCapacityProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: DeliveryCapacityItem[];
}

export const LandingProductDeliveryCapacity = React.forwardRef<HTMLElement, LandingProductDeliveryCapacityProps>(
  ({ className, title = "Expose delivery capacity before commitments drift", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-3xl font-semibold tracking-tight">{item.capacity}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                {item.coverage ? <div className="mt-3 text-sm text-muted-foreground">{item.coverage}</div> : null}
                {item.bottleneck ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.bottleneck}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDeliveryCapacity.displayName = "LandingProductDeliveryCapacity";