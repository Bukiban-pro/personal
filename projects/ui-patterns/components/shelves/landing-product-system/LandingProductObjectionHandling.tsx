import { cn } from "@/lib/utils";
import * as React from "react";

export interface ObjectionItem {
  objection: string;
  answer: string;
}

export interface LandingProductObjectionHandlingProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: ObjectionItem[];
}

export const LandingProductObjectionHandling = React.forwardRef<
  HTMLElement,
  LandingProductObjectionHandlingProps
>(({ className, title = "Objections Answered", description, items, ...props }, ref) => {
  const [openIndex, setOpenIndex] = React.useState<number>(0);

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-4">
          {items.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <article
                key={item.objection}
                className={cn(
                  "rounded-2xl border p-5 transition-colors",
                  isOpen ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <h3 className="text-base font-semibold tracking-tight">{item.objection}</h3>
                  <span className="text-sm text-muted-foreground">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen ? (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});

LandingProductObjectionHandling.displayName = "LandingProductObjectionHandling";
