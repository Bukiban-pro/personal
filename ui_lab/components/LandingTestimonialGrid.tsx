import { cn } from "@/lib/utils";
import { LandingTestimonial, TestimonialItem } from "./LandingTestimonial";

// ─── inline glow helper ────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Masonry-style testimonial grid — 1 → 2 → 3 columns.
 *
 * Pass a `featuredTestimonial` to pin it first with bolder styling.
 * `testimonialItems` fills the remaining cells.
 */
export const LandingTestimonialGrid = ({
  className,
  containerClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  testimonialItems,
  featuredTestimonial,
  withBackground,
  variant = "primary",
  withBackgroundGlow = false,
  backgroundGlowVariant = "primary",
}: {
  className?: string;
  containerClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  testimonialItems: TestimonialItem[];
  featuredTestimonial?: TestimonialItem;
  withBackground?: boolean;
  variant?: "primary" | "secondary";
  withBackgroundGlow?: boolean;
  backgroundGlowVariant?: "primary" | "secondary";
}) => (
  <section
    className={cn(
      "w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16",
      withBackground && variant === "primary" ? "bg-primary/5 dark:bg-primary/10" : "",
      withBackground && variant === "secondary" ? "bg-secondary/5 dark:bg-secondary/10" : "",
      withBackgroundGlow ? "relative overflow-hidden" : "",
      className,
    )}
  >
    {(title || description || titleComponent || descriptionComponent) && (
      <div className="w-full p-6 max-w-7xl mx-auto relative flex flex-col items-center">
        {titleComponent ||
          (title && (
            <h2 className="md:text-center text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight md:leading-tight max-w-sm sm:max-w-none">
              {title}
            </h2>
          ))}
        {descriptionComponent ||
          (description && <p className="mt-6 md:text-xl">{description}</p>)}
      </div>
    )}

    <div className="relative isolate w-full">
      {withBackgroundGlow && (
        <>
          <div
            className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-25 blur-3xl pointer-events-none"
            aria-hidden="true"
          >
            <div
              className={cn(
                "ml-[max(50%,38rem)] aspect-[1313/771] w-[82rem] bg-gradient-to-tr",
                backgroundGlowVariant === "primary" ? "from-primary/20 to-primary/40" : "from-secondary/20 to-secondary/40",
              )}
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
          <div
            className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-20 blur-3xl sm:pt-40 xl:justify-end pointer-events-none"
            aria-hidden="true"
          >
            <div
              className={cn(
                "ml-[-22rem] aspect-[1313/771] w-[82rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr xl:ml-0 xl:mr-[calc(50%-12rem)]",
                backgroundGlowVariant === "primary" ? "from-primary/20 to-primary/40" : "from-secondary/20 to-secondary/40",
              )}
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
        </>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-2xl xl:mx-0 xl:max-w-none text-sm leading-6 columns-1 md:columns-2 xl:columns-3 gap-4",
            containerClassName,
          )}
        >
          {featuredTestimonial && (
            <LandingTestimonial featured {...featuredTestimonial} className="mb-4 break-inside-avoid" />
          )}
          {testimonialItems.map((t, i) => (
            <LandingTestimonial key={i} {...t} className="mb-4 break-inside-avoid" />
          ))}
        </div>
      </div>
    </div>
  </section>
);
