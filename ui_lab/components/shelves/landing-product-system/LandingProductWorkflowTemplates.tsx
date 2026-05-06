import { cn } from "@/lib/utils";
import * as React from "react";

export interface WorkflowTemplateItem {
  title: string;
  workflow?: string;
  description?: string;
  includes: string[];
}

export interface LandingProductWorkflowTemplatesProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  templates: WorkflowTemplateItem[];
}

export const LandingProductWorkflowTemplates = React.forwardRef<
  HTMLElement,
  LandingProductWorkflowTemplatesProps
>(({ className, title = "Offer ready-made workflows instead of blank-slate setup", description, templates, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {templates.map((template) => (
            <article key={template.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {template.workflow ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{template.workflow}</div> : null}
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{template.title}</h3>
              {template.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{template.description}</p> : null}
              <ul className="mt-4 grid gap-2">
                {template.includes.map((item) => (
                  <li key={item} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductWorkflowTemplates.displayName = "LandingProductWorkflowTemplates";