import { cn } from "@/lib/utils";

// ─── Perspective presets ───────────────────────────────────────────────────

const perspectiveStyle: Record<string, React.CSSProperties> = {
  none: {},
  left: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4), -22px 25px 16px 0px rgba(0,0,0,.2)",
    transform: "perspective(400em) rotateY(-15deg) rotateX(6deg) skew(-8deg, 4deg) translate3d(-4%,-2%,0) scale(0.8)",
  },
  right: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4), 22px 25px 16px 0px rgba(0,0,0,.2)",
    transform: "perspective(400em) rotateY(15deg) rotateX(6deg) skew(8deg,-4deg) translate3d(4%,-2%,0) scale(0.8)",
  },
  bottom: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4)",
    transform: "translateY(-4%) perspective(400em) rotateX(18deg) scale(0.9)",
  },
  "bottom-lg": {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4)",
    transform: "perspective(400em) translate3d(0,-6%,0) rotateX(34deg) scale(0.8)",
  },
  paper: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4)",
    transform: "rotateX(40deg) rotate(40deg) scale(0.8)",
  },
};

// ─── GlowBg helper ─────────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Product feature section — title / description on one side, image on the other.
 *
 * `textPosition`: `'left'` (default) | `'center'`
 * `imagePosition`: `'left'` | `'right'` (default) | `'center'`
 * `imagePerspective`: CSS 3-D transform preset — `'none'` | `'left'` | `'right'` | `'bottom'` | `'bottom-lg'` | `'paper'`
 * `imageShadow`: `'none'` | `'soft'` | `'hard'`
 * Set `zoomOnHover` to scale image on hover. Set `withBackgroundGlow` for a subtle radial glow.
 *
 * Composes well inside `LandingProductFeaturesGrid` and `LandingProductSteps`.
 */
export const LandingProductFeature = ({
  children,
  className,
  innerClassName,
  textClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  leadingComponent,
  textPosition = "left",
  imageSrc,
  imageAlt = "",
  imagePosition,
  imagePerspective = "bottom",
  imageShadow,
  imageClassName,
  zoomOnHover = true,
  minHeight = 350,
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
  effectComponent,
  effectClassName,
  inContainer,
}: {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  textClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  leadingComponent?: React.ReactNode;
  textPosition?: "center" | "left";
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right" | "center";
  imagePerspective?: "none" | "left" | "right" | "bottom" | "bottom-lg" | "paper";
  imageShadow?: "none" | "soft" | "hard";
  imageClassName?: string;
  zoomOnHover?: boolean;
  minHeight?: number;
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
  effectComponent?: React.ReactNode;
  effectClassName?: string;
  inContainer?: boolean;
}) => {
  const isInContainer = inContainer || (!imagePosition && !imageShadow);
  const effectiveImagePosition = isInContainer ? "center" : (imagePosition ?? "right");
  const effectiveImageShadow = isInContainer ? "none" : (imageShadow ?? "hard");

  return (
    <section
      className={cn(
        "relative w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16",
        withBackground && variant === "primary" ? "bg-primary/5 dark:bg-primary/10" : "",
        withBackground && variant === "secondary" ? "bg-secondary/5 dark:bg-secondary/10" : "",
        withBackgroundGlow || imagePerspective !== "none" ? "overflow-hidden" : "",
        imagePerspective === "paper" ? "md:pb-24" : "",
        className,
      )}
    >
      {effectComponent && (
        <div className={cn("absolute inset-0", effectClassName)}>
          {effectComponent}
        </div>
      )}

      {imageSrc && withBackgroundGlow && (
        <div className="hidden lg:flex justify-center w-full h-full absolute pointer-events-none">
          <GlowBg
            className={cn(
              "w-full lg:w-1/2 h-auto z-0 dark:opacity-50",
              effectiveImagePosition === "center" ? "top-5" : "-top-1/3",
              imagePerspective === "paper" ? "opacity-70" : "opacity-100",
            )}
            variant={backgroundGlowVariant}
          />
        </div>
      )}

      <div
        className={cn(
          "w-full p-6 flex flex-col items-center relative",
          effectiveImagePosition === "center"
            ? "max-w-3xl mx-auto"
            : "max-w-7xl mx-auto grid gap-4 lg:gap-8 lg:grid-cols-12",
          innerClassName,
        )}
        style={{ minHeight: isInContainer ? 0 : minHeight }}
      >
        {/* Text block */}
        <div
          className={cn(
            "w-full flex flex-col gap-2 lg:gap-4",
            effectiveImagePosition === "left" ? "lg:col-start-7 lg:row-start-1" : "",
            textPosition === "center"
              ? "md:max-w-lg xl:max-w-2xl items-center text-center"
              : "items-start col-span-12 lg:col-span-6",
            textClassName,
          )}
        >
          {leadingComponent}

          {titleComponent ||
            (title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                {title}
              </h2>
            ))}

          {descriptionComponent ||
            (description && <p className="mt-4 md:text-xl">{description}</p>)}

          {children}
        </div>

        {/* Image block */}
        {imageSrc && (
          <>
            {effectiveImagePosition === "center" && (
              <section className="w-full mt-auto pt-4 md:pt-6 col-span-12">
                <img
                  className={cn(
                    "w-full rounded-md overflow-hidden",
                    effectiveImageShadow === "soft" && "shadow-md",
                    effectiveImageShadow === "hard" &&
                      "shadow-[0px_29px_52px_0px_rgba(0,0,0,0.4)]",
                    imageClassName,
                  )}
                  src={imageSrc}
                  alt={imageAlt}
                  width={1000}
                  height={1000}
                />
              </section>
            )}

            {(effectiveImagePosition === "left" ||
              effectiveImagePosition === "right") && (
              <img
                className={cn(
                  "relative w-full rounded-md col-span-12 lg:col-span-6",
                  zoomOnHover ? "lg:scale-90 hover:scale-100 transition-all" : "",
                  effectiveImageShadow === "soft" && "shadow-md",
                  effectiveImageShadow === "hard" &&
                    "shadow-[0px_29px_52px_0px_rgba(0,0,0,0.4)]",
                  effectiveImagePosition === "left" && "lg:-left-6",
                  effectiveImagePosition === "right" && "lg:-right-6",
                  imagePerspective !== "none" ? "my-8" : "my-4",
                  imageClassName,
                )}
                style={perspectiveStyle[imagePerspective]}
                alt={imageAlt}
                src={imageSrc}
                width={1000}
                height={1000}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};
