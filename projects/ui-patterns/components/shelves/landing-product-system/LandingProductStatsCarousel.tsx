import { cn } from "@/lib/utils";
import * as React from "react";

export interface StatsCarouselItem {
  label: string;
  value: string;
  detail?: string;
}

export interface LandingProductStatsCarouselProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  items: StatsCarouselItem[];
}

export const LandingProductStatsCarousel = React.forwardRef<HTMLElement, LandingProductStatsCarouselProps>(
  ({ className, title = "Highlights", items, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
      const timer = window.setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 4500);

      return () => window.clearInterval(timer);
    }, [items.length]);

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6">
          {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="border-b border-border bg-muted/40 p-6 lg:border-b-0 lg:border-r lg:border-border">
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "block w-full rounded-xl px-4 py-3 text-left transition-colors",
                        index === activeIndex ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
                    >
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.value}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex min-h-64 flex-col justify-between p-6 lg:p-8">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {items[activeIndex]?.label}
                  </div>
                  <div className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                    {items[activeIndex]?.value}
                  </div>
                  {items[activeIndex]?.detail ? (
                    <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                      {items[activeIndex]?.detail}
                    </p>
                  ) : null}
                </div>
                <div className="mt-8 flex gap-2">
                  {items.map((item, index) => (
                    <span
                      key={item.label}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        index === activeIndex ? "w-8 bg-primary" : "w-2 bg-border",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStatsCarousel.displayName = "LandingProductStatsCarousel";
