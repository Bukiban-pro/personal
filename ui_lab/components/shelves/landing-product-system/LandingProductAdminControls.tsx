import { cn } from "@/lib/utils";
import * as React from "react";

export interface AdminControlItem {
  title: string;
  detail?: string;
  category?: string;
}

export interface LandingProductAdminControlsProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  controls: AdminControlItem[];
}

export const LandingProductAdminControls = React.forwardRef<
  HTMLElement,
  LandingProductAdminControlsProps
>(({ className, title = "Show the admin controls before governance asks", description, controls, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {controls.map((control) => (
            <article key={control.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {control.category ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{control.category}</div> : null}
              <h3 className="mt-3 text-base font-semibold tracking-tight">{control.title}</h3>
              {control.detail ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{control.detail}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductAdminControls.displayName = "LandingProductAdminControls";