import { cn } from "@/lib/utils";
import * as React from "react";

export interface LaunchStripItem {
  label: string;
  value: string;
}

export interface LandingProductLaunchStripProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: LaunchStripItem[];
}

export const LandingProductLaunchStrip = React.forwardRef<HTMLElement, LandingProductLaunchStripProps>(
  ({ className, title = "Launch readiness", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-8", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6">
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/40 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
              {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {items.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-background px-4 py-3">
                  <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductLaunchStrip.displayName = "LandingProductLaunchStrip";
