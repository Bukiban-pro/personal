import { cn } from "@/lib/utils";
import * as React from "react";

export interface NarrativeProofItem {
  claim: string;
  proof?: string;
  implication?: string;
}

export interface LandingProductNarrativeProofProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: NarrativeProofItem[];
}

export const LandingProductNarrativeProof = React.forwardRef<HTMLElement, LandingProductNarrativeProofProps>(
  ({ className, title = "Support the narrative with proof blocks, not scattered stats", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.claim} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{item.claim}</h3>
                {item.proof ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.proof}</p> : null}
                {item.implication ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{item.implication}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductNarrativeProof.displayName = "LandingProductNarrativeProof";