"use client";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

// ─── inline glow helper ────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Collapsible FAQ section built on Radix Accordion.
 *
 * One item open at a time (`type="single" collapsible`).
 * Accepts `faqItems` with `{ question, answer }` — answer can be JSX.
 */
export const LandingFaqCollapsibleSection = ({
  className,
  title,
  titleComponent,
  description,
  descriptionComponent,
  faqItems,
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
}: {
  className?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  faqItems: FaqItem[];
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
}) => (
  <section
    className={cn(
      "relative w-full flex justify-center items-center gap-8 py-12 lg:py-16 flex-col",
      withBackground && variant === "primary" ? "bg-primary/5 dark:bg-primary/10" : "",
      withBackground && variant === "secondary" ? "bg-secondary/5 dark:bg-secondary/10" : "",
      withBackgroundGlow ? "overflow-hidden" : "",
      className,
    )}
  >
    {withBackgroundGlow && (
      <div className="hidden lg:flex justify-center w-full h-full absolute -bottom-1/2 pointer-events-none">
        <GlowBg className="w-full lg:w-2/3 h-auto z-0" variant={backgroundGlowVariant} />
      </div>
    )}

    <div className="w-full p-6 max-w-3xl mx-auto">
      {titleComponent ||
        (title && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight max-w-xs sm:max-w-none">
            {title}
          </h2>
        ))}

      {descriptionComponent ||
        (description && <p className="mt-6 md:text-xl">{description}</p>)}

      <Accordion type="single" collapsible className="w-full mt-12 relative z-10">
        {faqItems.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className={cn(
              withBackground && variant === "primary" ? "border-primary/10" : "",
              withBackground && variant === "secondary" ? "border-secondary/10" : "",
            )}
          >
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
