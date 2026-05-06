import { cn } from "@/lib/utils";

// ─── GlowBg helper ─────────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Logo / brand showcase section — grid of images/logos with heading.
 *
 * Renders companies, integrations, or partner logos in a responsive grid.
 * `textPosition`: `'left'` | `'right'` | `'center'` (stacks text above grid when centered).
 * Children are typically image elements or branded tiles.
 */
export const LandingShowcase = ({
  children,
  className,
  innerClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  textPosition = "left",
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
}: {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  textPosition?: "left" | "right" | "center";
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
}) => {
  return (
    <section
      className={cn(
        "w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16",
        withBackground && variant === "primary"
          ? "bg-primary/5 dark:bg-primary/10"
          : "",
        withBackground && variant === "secondary"
          ? "bg-secondary/5 dark:bg-secondary/10"
          : "",
        withBackgroundGlow ? "relative overflow-hidden" : "",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-16 items-center relative max-w-6xl mx-auto p-6",
          textPosition === "center" ? "grid-cols-1" : "lg:grid-cols-2",
          innerClassName,
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-4",
            textPosition === "left" && "order-1",
            textPosition === "right" && "order-2 lg:order-1",
            textPosition === "center" && "items-center text-center",
          )}
        >
          {titleComponent ||
            (title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                {title}
              </h2>
            ))}

          {descriptionComponent ||
            (description && (
              <p className="mt-4 md:text-xl">{description}</p>
            ))}
        </div>

        {withBackgroundGlow ? (
          <div className="hidden lg:flex justify-center w-full h-full absolute pointer-events-none">
            <GlowBg
              className={cn(
                "w-full lg:w-1/2 h-auto z-0 dark:opacity-50 -top-1/3",
              )}
              variant={backgroundGlowVariant}
            />
          </div>
        ) : null}

        {children ? (
          <div
            className={cn(
              "relative z-10 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-5 2xl:grid-cols-6 gap-4",
              textPosition === "right" && "lg:order-2",
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
};
