import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

// ─── inline glow helper ────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * FAQ section — renders a two-column grid of question/answer pairs.
 *
 * Pass `faqItems` array with `{ question, answer }` objects.
 * Optionally add a title, description, background colour, and glow effect.
 */
export const LandingFaqSection = ({
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
      "relative w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16",
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

    <div className="w-full p-6 max-w-7xl mx-auto">
      {titleComponent ||
        (title && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight max-w-xs sm:max-w-none">
            {title}
          </h2>
        ))}

      {descriptionComponent ||
        (description && <p className="mt-6 md:text-xl">{description}</p>)}

      <ul className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mt-12 lg:mt-16">
        {faqItems.map((item, i) => (
          <li key={i}>
            <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
            <p className="text-muted-foreground">{item.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
