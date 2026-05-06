import { cn } from "@/lib/utils";
import * as React from "react";

export interface ConfidenceKernelPrimitive {
  title: string;
  source?: string;
  certainty?: string;
  proof?: string;
}

export interface LandingProductConfidenceKernelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  primitives: ConfidenceKernelPrimitive[];
}

export const LandingProductConfidenceKernel = React.forwardRef<HTMLElement, LandingProductConfidenceKernelProps>(
  ({ className, title = "Reduce confidence to the smallest proof-bearing primitives", description, primitives, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {primitives.map((primitive) => (
              <article key={primitive.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{primitive.source || "Source"}</span>
                  <span>{primitive.certainty || "Certainty"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{primitive.title}</h3>
                {primitive.proof ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{primitive.proof}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductConfidenceKernel.displayName = "LandingProductConfidenceKernel";