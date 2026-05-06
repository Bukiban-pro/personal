import { cn } from "@/lib/utils";
import * as React from "react";

export interface ROIAssumption {
  label: string;
  value: string;
  detail?: string;
}

export interface ROIOutcome {
  label: string;
  value: string;
  detail?: string;
  emphasis?: "primary" | "default";
}

export interface LandingProductROIModelProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  assumptions: ROIAssumption[];
  outcomes: ROIOutcome[];
  note?: string;
  summaryTitle?: string;
}

export const LandingProductROIModel = React.forwardRef<
  HTMLElement,
  LandingProductROIModelProps
>(({ className, title = "Model the ROI before procurement asks", description, assumptions, outcomes, note, summaryTitle = "Projected impact", ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {assumptions.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">{item.value}</div>
                {item.detail ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <h3 className="text-lg font-semibold tracking-tight">{summaryTitle}</h3>
            <span className="text-sm text-muted-foreground">{outcomes.length} outputs</span>
          </div>

          <div className="mt-5 grid gap-3">
            {outcomes.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-2xl border p-4",
                  item.emphasis === "primary"
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/30",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">{item.label}</div>
                    {item.detail ? (
                      <div className="mt-1 text-sm text-muted-foreground">{item.detail}</div>
                    ) : null}
                  </div>
                  <div className="text-xl font-semibold tracking-tight">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {note ? <p className="mt-5 text-sm leading-6 text-muted-foreground">{note}</p> : null}
        </div>
      </div>
    </section>
  );
});

LandingProductROIModel.displayName = "LandingProductROIModel";