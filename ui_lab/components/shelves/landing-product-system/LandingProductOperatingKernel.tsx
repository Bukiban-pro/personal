import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingKernelPrimitive {
  title: string;
  policy?: string;
  contract?: string;
  failureMode?: string;
}

export interface LandingProductOperatingKernelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  primitives: OperatingKernelPrimitive[];
}

export const LandingProductOperatingKernel = React.forwardRef<HTMLElement, LandingProductOperatingKernelProps>(
  ({ className, title = "Reduce the operating model to the few primitives that actually govern it", description, primitives, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {primitives.map((primitive) => (
              <article key={primitive.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight">{primitive.title}</h3>
                {primitive.policy ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{primitive.policy}</p> : null}
                {primitive.contract ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{primitive.contract}</div> : null}
                {primitive.failureMode ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{primitive.failureMode}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperatingKernel.displayName = "LandingProductOperatingKernel";