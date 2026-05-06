import { cn } from "@/lib/utils";
import * as React from "react";

export interface ServiceMomentItem {
  title: string;
  moment?: string;
  expectation?: string;
  response?: string;
}

export interface LandingProductServiceMomentsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: ServiceMomentItem[];
}

export const LandingProductServiceMoments = React.forwardRef<HTMLElement, LandingProductServiceMomentsProps>(
  ({ className, title = "Highlight the service moments that shape trust", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {item.moment ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.moment}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{item.title}</h3>
                {item.expectation ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.expectation}</p> : null}
                {item.response ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{item.response}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductServiceMoments.displayName = "LandingProductServiceMoments";