import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingGenomeTrait {
  title: string;
  gene?: string;
  expression?: string;
  risk?: string;
}

export interface LandingProductOperatingGenomeProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  traits: OperatingGenomeTrait[];
}

export const LandingProductOperatingGenome = React.forwardRef<HTMLElement, LandingProductOperatingGenomeProps>(
  ({ className, title = "Describe the operating genome behind the system’s behavior", description, traits, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {traits.map((trait) => (
              <article key={trait.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {trait.gene ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{trait.gene}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{trait.title}</h3>
                {trait.expression ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{trait.expression}</p> : null}
                {trait.risk ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{trait.risk}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperatingGenome.displayName = "LandingProductOperatingGenome";