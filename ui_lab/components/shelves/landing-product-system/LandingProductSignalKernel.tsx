import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalKernelPrimitive {
  title: string;
  source?: string;
  normalization?: string;
  action?: string;
}

export interface LandingProductSignalKernelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  primitives: SignalKernelPrimitive[];
}

export const LandingProductSignalKernel = React.forwardRef<HTMLElement, LandingProductSignalKernelProps>(
  ({ className, title = "Reduce noisy signal flow to a usable kernel", description, primitives, ...props }, ref) => {
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
                {primitive.source ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{primitive.source}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{primitive.title}</h3>
                {primitive.normalization ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{primitive.normalization}</p> : null}
                {primitive.action ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{primitive.action}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalKernel.displayName = "LandingProductSignalKernel";