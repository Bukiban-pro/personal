import { cn } from "@/lib/utils";
import * as React from "react";

export interface ProofItem {
  label: string;
  value: string;
  detail?: string;
}

export interface LandingProductProofProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: ProofItem[];
  eyebrow?: string;
}

export const LandingProductProof = React.forwardRef<HTMLElement, LandingProductProofProps>(
  ({ className, title, description, items, eyebrow = "Proof", ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {eyebrow}
            </p>
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
                {item.detail ? <div className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductProof.displayName = "LandingProductProof";
