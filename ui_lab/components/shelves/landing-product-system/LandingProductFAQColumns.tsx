import { cn } from "@/lib/utils";
import * as React from "react";

export interface FAQColumnItem {
  question: string;
  answer: string;
}

export interface LandingProductFAQColumnsProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: FAQColumnItem[];
}

export const LandingProductFAQColumns = React.forwardRef<
  HTMLElement,
  LandingProductFAQColumnsProps
>(({ className, title = "FAQ", description, items, ...props }, ref) => {
  const left = items.filter((_, index) => index % 2 === 0);
  const right = items.filter((_, index) => index % 2 !== 0);

  const renderColumn = (columnItems: FAQColumnItem[]) => (
    <div className="space-y-3">
      {columnItems.map((item) => (
        <article key={item.question} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-tight">{item.question}</h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.answer}</p>
        </article>
      ))}
    </div>
  );

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {renderColumn(left)}
          {renderColumn(right)}
        </div>
      </div>
    </section>
  );
});

LandingProductFAQColumns.displayName = "LandingProductFAQColumns";
