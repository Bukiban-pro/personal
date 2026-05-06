import { cn } from "@/lib/utils";
import * as React from "react";

export interface ComparisonChecklistItem {
  label: string;
  ours: boolean;
  theirs: boolean;
  note?: string;
}

export interface LandingProductComparisonChecklistProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: ComparisonChecklistItem[];
  leftLabel?: string;
  rightLabel?: string;
}

function ChecklistPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]",
        active
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {active ? "Included" : "Missing"}
    </span>
  );
}

export const LandingProductComparisonChecklist = React.forwardRef<
  HTMLElement,
  LandingProductComparisonChecklistProps
>(({ className, title = "Make the shortlist decision obvious", description, items, leftLabel = "Ours", rightLabel = "Alternative", ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1.1fr_0.7fr_0.7fr]">
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Checklist</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">{leftLabel}</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">{rightLabel}</div>
          </div>

          <div className="divide-y divide-border">
            {items.map((item) => (
              <article key={item.label} className="grid gap-4 px-5 py-5 md:grid-cols-[1.1fr_0.7fr_0.7fr] md:px-6">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{item.label}</h3>
                  {item.note ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
                  ) : null}
                </div>
                <div>
                  <ChecklistPill active={item.ours} />
                </div>
                <div>
                  <ChecklistPill active={item.theirs} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductComparisonChecklist.displayName = "LandingProductComparisonChecklist";