import { cn } from "@/lib/utils";
import * as React from "react";

export interface PricingFAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface LandingProductPricingFAQProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: PricingFAQItem[];
}

export const LandingProductPricingFAQ = React.forwardRef<
  HTMLElement,
  LandingProductPricingFAQProps
>(({ className, title = "Pricing questions that slow down approvals", description, items, ...props }, ref) => {
  const categories = [
    "All",
    ...Array.from(new Set(items.map((item) => item.category).filter(Boolean))) as string[],
  ];
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [openQuestion, setOpenQuestion] = React.useState<string | null>(null);

  const visibleItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);
  const activeQuestion = visibleItems.some((item) => item.question === openQuestion)
    ? openQuestion
    : visibleItems[0]?.question || null;

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                category === activeCategory
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/40",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {visibleItems.map((item) => {
            const isOpen = item.question === activeQuestion;

            return (
              <article
                key={item.question}
                className={cn(
                  "rounded-2xl border p-5 transition-colors",
                  isOpen ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                >
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{item.question}</h3>
                    {item.category ? (
                      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {item.category}
                      </div>
                    ) : null}
                  </div>
                  <span className="text-sm text-muted-foreground">{isOpen ? "Hide" : "Show"}</span>
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

LandingProductPricingFAQ.displayName = "LandingProductPricingFAQ";