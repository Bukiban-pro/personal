import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

// ─── GlowBg helper ─────────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Pricing plan card — typically rendered in a grid alongside other plans.
 *
 * `featured`: Renders with dark background (inverted) and emphasis styling.
 * `highlighted`: Renders with primary color accent and glow effect.
 * `soldOut`: Disables button and adds opacity.
 * `children`: Array of feature strings or JSX — rendered as a checklist.
 * `price`: Required. `discountPrice` strikes through the original price.
 * `priceSuffix`: e.g. "/month" or "/year" displayed next to price.
 */
export const LandingPricingPlan = ({
  className,
  children,
  title,
  titleComponent,
  description,
  descriptionComponent,
  href = "#",
  onClick = () => {},
  ctaText = "Get started",
  price,
  discountPrice,
  priceSuffix,
  featured,
  highlighted,
  soldOut,
}: {
  className?: string;
  children: React.ReactNode;
  title?: string;
  titleComponent?: React.ReactNode;
  description?: string;
  descriptionComponent?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  ctaText?: string;
  price: string;
  discountPrice?: string;
  priceSuffix?: string;
  featured?: boolean;
  highlighted?: boolean;
  soldOut?: boolean;
}) => {
  return (
    <div
      className={cn(
        "max-w-xs border rounded-3xl p-8 xl:p-10 relative overflow-hidden",
        highlighted
          ? "bg-white dark:bg-gray-900/80 border-primary/50 dark:border-primary/40"
          : "",
        featured
          ? "bg-gray-900 border-gray-900 dark:bg-gray-100 dark:border-gray-100"
          : "",
        !featured && !highlighted
          ? "bg-white dark:bg-gray-900/80 border-gray-300/70 dark:border-gray-700"
          : "",
        className,
      )}
    >
      {highlighted ? (
        <>
          <div
            className="absolute pointer-events-none left-0 top-0 w-full h-full bg-primary/5"
            aria-hidden
          />
          <div
            className="absolute pointer-events-none left-0 top-0 w-full h-full bg-primary/30 dark:bg-primary/5 mix-blend-hard-light dark:mix-blend-soft-light"
            aria-hidden
          />
          <div
            className="hidden lg:flex justify-center w-full h-full absolute left-0 -top-[45%] pointer-events-none"
            aria-hidden
          >
            <GlowBg
              className={cn(
                "w-full h-auto z-0 dark:opacity-50 opacity-100"
              )}
              variant="primary"
            />
          </div>
        </>
      ) : null}

      <div className="relative z-10">
        {title ? (
          <h3
            className={cn(
              "text-2xl font-bold tracking-tight",
              featured ? "w-full text-white dark:text-black" : "",
            )}
          >
            {title}
          </h3>
        ) : (
          titleComponent
        )}

        {description ? (
          <p
            className={cn(
              "w-full text-sm leading-6 mt-2",
              featured
                ? "text-gray-300 dark:text-gray-500"
                : "text-gray-600 dark:text-gray-400",
            )}
          >
            {description}
          </p>
        ) : (
          descriptionComponent
        )}

        <p className="mt-6 flex items-baseline gap-x-1">
          <span
            className={cn(
              featured ? "text-white dark:text-black" : "",
              "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight",
              discountPrice ? "line-through" : "",
            )}
          >
            {price}
          </span>

          <span className={cn(featured ? "text-white dark:text-black" : "")}>
            {discountPrice}
          </span>

          {priceSuffix ? (
            <span
              className={cn(
                featured
                  ? "text-gray-300 dark:text-gray-500"
                  : "dark:text-gray-400 text-gray-600",
                "text-sm font-semibold leading-6",
              )}
            >
              {priceSuffix}
            </span>
          ) : null}
        </p>

        <a
          href={href}
          onClick={onClick}
          className={cn(
            "w-full mt-6 shadow-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none",
            featured || soldOut ? "grayscale" : "",
            !highlighted && !featured
              ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              : "",
            highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
            featured ? "bg-white text-gray-900 hover:bg-gray-100" : "",
            soldOut ? "opacity-50 pointer-events-none" : "",
            "h-11 px-8 text-base",
          )}
          aria-disabled={soldOut}
        >
          {soldOut ? "Sold out" : ctaText}
        </a>

        {Array.isArray(children) ? (
          <ul
            className={cn(
              featured
                ? "text-gray-300 dark:text-gray-500"
                : "text-gray-700 dark:text-gray-400",
              "mt-8 space-y-3 text-sm leading-6 xl:mt-10",
            )}
          >
            {children.map((child, index) => (
              <li key={index} className="flex gap-x-3">
                <CheckIcon
                  className={cn(
                    featured ? "text-white dark:text-black" : "",
                    highlighted ? "text-primary" : "text-gray-500",
                    "h-6 w-5 flex-none",
                  )}
                  aria-hidden="true"
                />
                {child}
              </li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
