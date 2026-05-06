import { cn } from "@/lib/utils";
import * as React from "react";

export interface ValueKernelLayer {
  title: string;
  primitive?: string;
  compounding?: string;
  proof?: string;
}

export interface LandingProductValueKernelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  layers: ValueKernelLayer[];
}

export const LandingProductValueKernel = React.forwardRef<HTMLElement, LandingProductValueKernelProps>(
  ({ className, title = "Reduce value to the kernel that compounds through the system", description, layers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {layers.map((layer) => (
              <article key={layer.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight">{layer.title}</h3>
                {layer.primitive ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{layer.primitive}</p> : null}
                {layer.compounding ? <div className="mt-4 text-sm font-medium text-foreground">{layer.compounding}</div> : null}
                {layer.proof ? <div className="mt-2 text-sm text-muted-foreground">{layer.proof}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductValueKernel.displayName = "LandingProductValueKernel";