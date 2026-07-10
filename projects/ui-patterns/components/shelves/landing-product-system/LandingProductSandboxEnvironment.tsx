import { cn } from "@/lib/utils";
import * as React from "react";

export interface SandboxEnvironmentItem {
  title: string;
  description?: string;
  access?: string;
  features?: string[];
}

export interface LandingProductSandboxEnvironmentProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: SandboxEnvironmentItem[];
}

export const LandingProductSandboxEnvironment = React.forwardRef<HTMLElement, LandingProductSandboxEnvironmentProps>(
  ({ className, title = "Offer a sandbox that feels structured, not improvised", description, items, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeItem = items.length > 0 ? items[Math.min(activeIndex, items.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
            <div className="space-y-3">
              {items.map((item, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(items.length - 1, 0));

                return (
                  <button key={item.title} type="button" onClick={() => setActiveIndex(index)} className={cn("w-full rounded-2xl border p-5 text-left transition-colors", isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40")}>
                    <div className="text-base font-semibold tracking-tight">{item.title}</div>
                    {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                  </button>
                );
              })}
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeItem ? (
                <>
                  {activeItem.access ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeItem.access}</div> : null}
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeItem.title}</h3>
                  {activeItem.description ? <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{activeItem.description}</p> : null}
                  {activeItem.features?.length ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {activeItem.features.map((feature) => (
                        <div key={feature} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                          {feature}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add sandbox items to populate the environment.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSandboxEnvironment.displayName = "LandingProductSandboxEnvironment";