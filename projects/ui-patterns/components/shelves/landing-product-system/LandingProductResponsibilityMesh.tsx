import { cn } from "@/lib/utils";
import * as React from "react";

export interface ResponsibilityMeshRow {
  domain: string;
  primary?: string;
  partner?: string;
  handoff?: string;
}

export interface LandingProductResponsibilityMeshProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: ResponsibilityMeshRow[];
}

export const LandingProductResponsibilityMesh = React.forwardRef<HTMLElement, LandingProductResponsibilityMeshProps>(
  ({ className, title = "Render responsibilities as a mesh instead of a vague matrix", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_0.9fr_0.9fr_1.1fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Domain</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Primary</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Partner</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Handoff</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.domain} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_0.9fr_0.9fr_1.1fr] md:px-6">
                  <div className="text-sm font-medium">{row.domain}</div>
                  <div className="text-sm text-muted-foreground">{row.primary || "Primary owner"}</div>
                  <div className="text-sm text-muted-foreground">{row.partner || "Partner owner"}</div>
                  <div className="text-sm text-muted-foreground">{row.handoff || "Escalation path"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductResponsibilityMesh.displayName = "LandingProductResponsibilityMesh";