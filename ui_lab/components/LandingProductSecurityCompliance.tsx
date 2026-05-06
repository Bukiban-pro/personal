import { cn } from "@/lib/utils";
import * as React from "react";

export interface SecurityCertificationItem {
  name: string;
  status?: string;
  detail?: string;
}

export interface SecurityControlItem {
  title: string;
  description?: string;
}

export interface LandingProductSecurityComplianceProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  eyebrow?: string;
  certifications: SecurityCertificationItem[];
  controls: SecurityControlItem[];
}

export const LandingProductSecurityCompliance = React.forwardRef<
  HTMLElement,
  LandingProductSecurityComplianceProps
>(({ className, title = "Security that clears review faster", description, eyebrow = "Security + Compliance", certifications, controls, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="inline-flex w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-3">
            {certifications.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-border bg-muted/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold tracking-tight">{item.name}</h3>
                  {item.status ? (
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {item.status}
                    </span>
                  ) : null}
                </div>
                {item.detail ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {controls.map((control) => (
            <article
              key={control.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                {control.title.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{control.title}</h3>
              {control.description ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {control.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductSecurityCompliance.displayName = "LandingProductSecurityCompliance";