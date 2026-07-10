import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalMapItem {
  title: string;
  category?: string;
  signal?: string;
  action?: string;
}

export interface LandingProductSignalMapProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: SignalMapItem[];
}

export const LandingProductSignalMap = React.forwardRef<
  HTMLElement,
  LandingProductSignalMapProps
>(({ className, title = "Make critical signals visible before teams argue from instinct", description, items, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                {item.category ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.category}</div> : <div />}
                {item.signal ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.signal}</div> : null}
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight">{item.title}</h3>
              {item.action ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.action}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductSignalMap.displayName = "LandingProductSignalMap";