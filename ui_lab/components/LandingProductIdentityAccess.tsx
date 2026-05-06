import { cn } from "@/lib/utils";
import * as React from "react";

export interface IdentityAccessItem {
  title: string;
  support?: string;
  description?: string;
  category?: string;
}

export interface LandingProductIdentityAccessProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: IdentityAccessItem[];
}

export const LandingProductIdentityAccess = React.forwardRef<HTMLElement, LandingProductIdentityAccessProps>(
  ({ className, title = "Surface identity and access controls early", description, items, ...props }, ref) => {
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
                {item.category ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.category}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{item.title}</h3>
                {item.support ? <div className="mt-2 text-sm font-medium text-foreground">{item.support}</div> : null}
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductIdentityAccess.displayName = "LandingProductIdentityAccess";