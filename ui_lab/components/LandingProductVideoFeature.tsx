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
 * Product feature section with embedded video instead of static image.
 *
 * `videoSrc`: Required URL to video file (mp4, webm, etc.)
 * `videoPoster`: Optional thumbnail image shown before video plays
 * `textPosition`: `'left'` (default) | `'center'`
 * `videoPosition`: `'left'` | `'right'` (default) | `'center'`
 * `autoPlay`, `muted`, `controls`, `loop`: Video player options
 * `zoomOnHover`: Scale video on hover (desktop only)
 *
 * Same composition compatibility as `LandingProductFeature` for use in grids/steps.
 */
export const LandingProductVideoFeature = ({
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
  videoSrc,
  videoPoster,
  videoPosition,
  videoMaxWidth = "none",
  autoPlay,
  muted = true,
  controls = false,
  loop = false,
  zoomOnHover = false,
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
  videoSrc?: string;
  videoPoster?: string;
  videoPosition?: "left" | "right" | "center";
  videoMaxWidth?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
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
  const isInContainer = inContainer || !videoPosition;
  const defaultVideoPosition =
    videoPosition !== undefined ? videoPosition : "right";
  const effectiveVideoPosition = isInContainer ? "center" : defaultVideoPosition;

  return (
    <section
      className={cn(
        "relative w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16",
        withBackground && variant === "primary"
          ? "bg-primary/5 dark:bg-primary/10"
          : "",
        withBackground && variant === "secondary"
          ? "bg-secondary/5 dark:bg-secondary/10"
          : "",
        withBackgroundGlow ? "overflow-hidden" : "",
        className,
      )}
    >
      {effectComponent && (
        <div className={cn("absolute inset-0", effectClassName)}>
          {effectComponent}
        </div>
      )}

      {videoSrc && withBackgroundGlow && (
        <div className="hidden lg:flex justify-center w-full h-full absolute pointer-events-none">
          <GlowBg
            className={cn(
              "w-full lg:w-1/2 h-auto z-0 dark:opacity-50",
              effectiveVideoPosition === "center" ? "top-5" : "-top-1/3",
            )}
            variant={backgroundGlowVariant}
          />
        </div>
      )}

      <div
        className={cn(
          "w-full p-6 flex flex-col items-center relative",
          effectiveVideoPosition === "center"
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
            effectiveVideoPosition === "left" ? "lg:col-start-7 lg:row-start-1" : "",
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

        {/* Video block */}
        {videoSrc ? (
          <>
            {effectiveVideoPosition === "center" && (
              <section className="w-full mt-auto pt-4 md:pt-6 col-span-12">
                <video
                  className="w-full rounded-md overflow-hidden shadow-[0px_29px_52px_0px_rgba(0,0,0,0.4)]"
                  src={videoSrc}
                  poster={videoPoster}
                  autoPlay={autoPlay}
                  muted={muted}
                  controls={controls}
                  loop={loop}
                  width={1000}
                  height={1000}
                />
              </section>
            )}

            {(effectiveVideoPosition === "left" ||
              effectiveVideoPosition === "right") && (
              <video
                className={cn(
                  "relative w-full rounded-md col-span-12 lg:col-span-6",
                  zoomOnHover ? "lg:scale-90 hover:scale-100 transition-all" : "",
                  "shadow-[0px_29px_52px_0px_rgba(0,0,0,0.4)]",
                  effectiveVideoPosition === "left" && "lg:-left-6",
                  effectiveVideoPosition === "right" && "lg:-right-6",
                  "my-4",
                )}
                style={{ maxWidth: videoMaxWidth }}
                src={videoSrc}
                poster={videoPoster}
                autoPlay={autoPlay}
                muted={muted}
                controls={controls}
                loop={loop}
                width={1000}
                height={1000}
              />
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};
