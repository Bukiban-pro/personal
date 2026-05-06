import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExecutiveReviewPackItem {
  title: string;
  audience?: string;
  description?: string;
  outputs?: string[];
}

export interface LandingProductExecutiveReviewPackProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: ExecutiveReviewPackItem[];
  action?: React.ReactNode;
}

export const LandingProductExecutiveReviewPack = React.forwardRef<HTMLElement, LandingProductExecutiveReviewPackProps>(
  ({ className, title = "Package the executive review into one clean handoff", description, items, action, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {item.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.audience}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{item.title}</h3>
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                {item.outputs?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.outputs.map((output) => (
                      <span key={output} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{output}</span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExecutiveReviewPack.displayName = "LandingProductExecutiveReviewPack";