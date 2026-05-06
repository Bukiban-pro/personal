import { cn } from "@/lib/utils";
import * as React from "react";

export interface ProofOrchestraSection {
  title: string;
  instrument?: string;
  role?: string;
  evidence?: string;
  timing?: string;
}

export interface LandingProductProofOrchestraProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  sections: ProofOrchestraSection[];
}

export const LandingProductProofOrchestra = React.forwardRef<HTMLElement, LandingProductProofOrchestraProps>(
  ({ className, title = "Conduct proof like an orchestra instead of dropping disconnected claims", description, sections, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{section.instrument || "Instrument"}</span>
                  <span>{section.timing || "Timing"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{section.title}</h3>
                {section.role ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.role}</p> : null}
                {section.evidence ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{section.evidence}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductProofOrchestra.displayName = "LandingProductProofOrchestra";