import { cn } from "@/lib/utils";
import * as React from "react";

export interface ComplianceMappingRow {
  framework: string;
  control: string;
  evidence?: string;
}

export interface LandingProductComplianceMappingsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: ComplianceMappingRow[];
}

export const LandingProductComplianceMappings = React.forwardRef<HTMLElement, LandingProductComplianceMappingsProps>(
  ({ className, title = "Map controls to frameworks without extra guesswork", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.8fr_1fr_1.2fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Framework</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Control</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Evidence</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={`${row.framework}-${row.control}`} className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_1fr_1.2fr] md:px-6">
                  <div className="text-sm font-medium">{row.framework}</div>
                  <div className="text-sm text-muted-foreground">{row.control}</div>
                  <div className="text-sm text-muted-foreground">{row.evidence || "Shared artifact"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductComplianceMappings.displayName = "LandingProductComplianceMappings";