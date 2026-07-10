import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductCompareColumns
 * Side-by-side comparison of "before" (old workflow) vs "after" (with product).
 * Pattern: before/after / "without vs with" comparison — common Stripe-style SaaS section.
 */

export interface CompareRow {
  label: string;
  before: string;
  after: string;
}

export interface LandingProductCompareColumnsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  beforeLabel?: string;
  afterLabel?: string;
  rows?: CompareRow[];
}

const DEFAULT_ROWS: CompareRow[] = [
  {
    label: "Forecast process",
    before: "Manual spreadsheet updates every Friday. 4+ hours per manager.",
    after: "Live AI forecast always current. 20-minute review meetings.",
  },
  {
    label: "Deal visibility",
    before: "CRM data stale by Thursday. Reps update only when pushed.",
    after: "Auto-synced signals from email, calls, and CRM in real time.",
  },
  {
    label: "Risk identification",
    before: "Discovered in the QBR. Deals slip without warning.",
    after: "Anomaly alerts 30 days before a deal goes dark.",
  },
  {
    label: "Stakeholder coverage",
    before: "Rely on rep memory and scattered notes.",
    after: "Full buying committee mapped, engagement scored.",
  },
  {
    label: "Coaching",
    before: "Manager reviews based on rep self-report. Anecdotal.",
    after: "Call intelligence highlights objections and talk ratios automatically.",
  },
];

export const LandingProductCompareColumns = React.forwardRef<HTMLElement, LandingProductCompareColumnsProps>(
  (
    {
      className,
      title = "What changes when you switch",
      description = "See the difference in how your revenue org actually operates.",
      beforeLabel = "Without the platform",
      afterLabel = "With the platform",
      rows = DEFAULT_ROWS,
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-border">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-border">
              <div className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground" />
              <div className="border-l border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-sm font-semibold text-muted-foreground">{beforeLabel}</span>
                </div>
              </div>
              <div className="border-l border-border bg-primary/5 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-primary">{afterLabel}</span>
                </div>
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-[1fr_1fr_1fr] border-b border-border last:border-b-0",
                  i % 2 === 0 ? "bg-background" : "bg-card",
                )}
              >
                <div className="px-5 py-4">
                  <span className="text-sm font-medium text-foreground">{row.label}</span>
                </div>
                <div className="border-l border-border px-5 py-4">
                  <p className="text-sm leading-6 text-muted-foreground">{row.before}</p>
                </div>
                <div className="border-l border-border bg-primary/5 px-5 py-4">
                  <p className="text-sm font-medium leading-6 text-foreground">{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCompareColumns.displayName = "LandingProductCompareColumns";
