import { cn } from "@/lib/utils";
import * as React from "react";

export interface DeploymentOptionItem {
  name: string;
  model?: string;
  description?: string;
  requirements?: string[];
}

export interface LandingProductDeploymentOptionsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  options: DeploymentOptionItem[];
}

export const LandingProductDeploymentOptions = React.forwardRef<HTMLElement, LandingProductDeploymentOptionsProps>(
  ({ className, title = "Show deployment choices without forcing one path", description, options, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {options.map((option) => (
              <article key={option.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {option.model ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{option.model}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{option.name}</h3>
                {option.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{option.description}</p> : null}
                {option.requirements?.length ? (
                  <ul className="mt-4 grid gap-2">
                    {option.requirements.map((requirement) => (
                      <li key={requirement} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {requirement}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDeploymentOptions.displayName = "LandingProductDeploymentOptions";