import { cn } from "@/lib/utils";
import * as React from "react";

export interface RenewalSignalItem {
  label: string;
  value: string;
  detail?: string;
  status?: "strong" | "watch" | "risk";
}

export interface LandingProductRenewalSignalsProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  signals: RenewalSignalItem[];
}

export const LandingProductRenewalSignals = React.forwardRef<
  HTMLElement,
  LandingProductRenewalSignalsProps
>(({ className, title = "Show renewal health before the conversation gets political", description, signals, ...props }, ref) => {
  const statusStyles = {
    strong: "border-emerald-500/30 bg-emerald-500/10",
    watch: "border-amber-500/30 bg-amber-500/10",
    risk: "border-rose-500/30 bg-rose-500/10",
  } as const;

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {signals.map((signal) => {
            const status = signal.status || "watch";

            return (
              <article key={signal.label} className={cn("rounded-2xl border p-6 shadow-sm", statusStyles[status])}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-muted-foreground">{signal.label}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{status}</div>
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{signal.value}</div>
                {signal.detail ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{signal.detail}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});

LandingProductRenewalSignals.displayName = "LandingProductRenewalSignals";