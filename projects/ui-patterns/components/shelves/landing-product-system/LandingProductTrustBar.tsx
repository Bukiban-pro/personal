import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustBarItem {
  name: string;
  logo?: React.ReactNode;
}

export interface LandingProductTrustBarProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  items: TrustBarItem[];
}

export const LandingProductTrustBar = React.forwardRef<HTMLElement, LandingProductTrustBarProps>(
  ({ className, title = "Trusted by teams that ship", items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-8", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {title}
            </p>
            <span className="text-sm text-muted-foreground">{items.length} organizations</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.name} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                {item.logo ? <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">{item.logo}</span> : null}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustBar.displayName = "LandingProductTrustBar";
