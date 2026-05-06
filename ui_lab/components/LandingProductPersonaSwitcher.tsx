import { cn } from "@/lib/utils";
import * as React from "react";

export interface PersonaSwitcherItem {
  name: string;
  role?: string;
  summary?: string;
  challenges?: string[];
  wins?: string[];
  action?: React.ReactNode;
}

export interface LandingProductPersonaSwitcherProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  personas: PersonaSwitcherItem[];
}

export const LandingProductPersonaSwitcher = React.forwardRef<
  HTMLElement,
  LandingProductPersonaSwitcherProps
>(({ className, title = "Show each stakeholder their version of the value", description, personas, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const safeIndex = personas.length === 0 ? -1 : Math.min(activeIndex, personas.length - 1);
  const activePersona = safeIndex >= 0 ? personas[safeIndex] : null;

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="space-y-3">
            {personas.map((persona, index) => {
              const isActive = index === safeIndex;

              return (
                <button
                  key={persona.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-colors",
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="text-base font-semibold tracking-tight">{persona.name}</div>
                  {persona.role ? (
                    <div className="mt-1 text-sm text-muted-foreground">{persona.role}</div>
                  ) : null}
                  {persona.summary ? (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{persona.summary}</p>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
            {activePersona ? (
              <>
                <div className="flex flex-col gap-3 border-b border-border pb-5">
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {activePersona.role || "Active persona"}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {activePersona.name}
                  </h3>
                  {activePersona.summary ? (
                    <p className="text-sm leading-7 text-muted-foreground md:text-base">
                      {activePersona.summary}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    <h4 className="text-sm font-semibold tracking-tight">Buying questions</h4>
                    <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                      {(activePersona.challenges || []).map((item) => (
                        <li key={item} className="rounded-xl bg-background px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    <h4 className="text-sm font-semibold tracking-tight">What they care about</h4>
                    <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                      {(activePersona.wins || []).map((item) => (
                        <li key={item} className="rounded-xl bg-background px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {activePersona.action ? <div className="mt-6">{activePersona.action}</div> : null}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Add personas to populate the switcher.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductPersonaSwitcher.displayName = "LandingProductPersonaSwitcher";