"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// ─── inline helpers ────────────────────────────────────────────────────────

/** Fades content top and bottom to transparent with a CSS mask. */
export const FadeMask = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    fadeHeight?: string;
  }
>(({ children, className, fadeHeight = "3rem" }, ref) => (
  <div
    ref={ref}
    className={cn("overflow-hidden", className)}
    style={{
      maskImage: `linear-gradient(to bottom, transparent 0%, black ${fadeHeight}, black calc(100% - ${fadeHeight}), transparent 100%)`,
      WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${fadeHeight}, black calc(100% - ${fadeHeight}), transparent 100%)`,
    }}
  >
    {children}
  </div>
));
FadeMask.displayName = "FadeMask";

/** Decorative background glow blob. */
const GlowBg = ({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: "primary" | "secondary";
}) => (
  <div
    aria-hidden="true"
    className={cn(
      "absolute pointer-events-none blur-[100px]",
      variant === "primary" ? "bg-primary/20" : "bg-secondary/20",
      className,
    )}
  />
);

// ─── shared text block ─────────────────────────────────────────────────────

const CtaContent = ({
  className,
  childrenClassName,
  textPosition = "left",
  title,
  titleComponent,
  description,
  descriptionComponent,
  leadingComponent,
  children,
}: {
  className?: string;
  childrenClassName?: string;
  textPosition?: "center" | "left";
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  leadingComponent?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex flex-col gap-4",
      textPosition === "center" ? "items-center text-center" : "justify-center",
      className,
    )}
  >
    {leadingComponent}

    {titleComponent ||
      (title && (
        <h1 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold md:max-w-2xl">
          {title}
        </h1>
      ))}

    {descriptionComponent ||
      (description && <p className="md:text-lg md:max-w-xl">{description}</p>)}

    <div
      className={cn(
        "flex flex-wrap gap-4 mt-2",
        textPosition === "center" ? "justify-center" : "justify-start",
        childrenClassName,
      )}
    >
      {children}
    </div>
  </div>
);

// ─── Perspective helper classes (inline styles) ────────────────────────────

const perspectiveStyle: Record<string, React.CSSProperties> = {
  none: {},
  left: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4), -22px 25px 16px 0px rgba(0,0,0,.2)",
    transform: "perspective(400em) rotateY(-15deg) rotateX(6deg) skew(-8deg, 4deg) translate3d(-4%, -2%, 0) scale(0.8)",
  },
  right: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4), 22px 25px 16px 0px rgba(0,0,0,.2)",
    transform: "perspective(400em) rotateY(15deg) rotateX(6deg) skew(8deg, -4deg) translate3d(4%, -2%, 0) scale(0.8)",
  },
  bottom: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4)",
    transform: "translateY(-4%) perspective(400em) rotateX(18deg) scale(0.9)",
  },
  "bottom-lg": {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4)",
    transform: "perspective(400em) translate3d(0, -6%, 0) rotateX(34deg) scale(0.8)",
  },
  paper: {
    boxShadow: "0px 29px 52px 0px rgba(0,0,0,.4)",
    transform: "rotateX(40deg) rotate(40deg) scale(0.8)",
  },
};

// ─── LandingPrimaryImageCtaSection ─────────────────────────────────────────

/**
 * Primary CTA section with a hero image beside the text.
 *
 * `imagePosition` controls layout: left | right | center.
 * `imagePerspective` applies a 3-D CSS transform preset: none | left | right | bottom | bottom-lg | paper.
 * Supports optional `leadingComponent` (pill/badge above the title), `footerComponent` below.
 */
export const LandingPrimaryImageCtaSection = ({
  children,
  className,
  innerClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  leadingComponent,
  footerComponent,
  textPosition = "left",
  imageSrc,
  imageAlt = "",
  imagePosition = "right",
  imagePerspective = "none",
  imageShadow = "hard",
  minHeight = 350,
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
  effectComponent,
  effectClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  leadingComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  textPosition?: "center" | "left";
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right" | "center";
  imagePerspective?: "none" | "left" | "right" | "bottom" | "bottom-lg" | "paper";
  imageShadow?: "none" | "soft" | "hard";
  minHeight?: number;
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
  effectComponent?: React.ReactNode;
  effectClassName?: string;
}) => (
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
      <FadeMask
        className={cn("absolute inset-0 h-full w-full pointer-events-none opacity-50", effectClassName)}
        fadeHeight="4rem"
        aria-hidden="true"
      >
        {effectComponent}
      </FadeMask>
    )}

    {imageSrc && withBackgroundGlow && (
      <div className="hidden lg:flex justify-center w-full h-full absolute pointer-events-none">
        <GlowBg
          className={cn(
            "w-full lg:w-1/2 h-auto z-0 dark:opacity-50",
            imagePosition === "center" ? "top-5" : "-top-1/3",
            imagePerspective === "paper" ? "opacity-70" : "opacity-100",
          )}
          variant={backgroundGlowVariant}
        />
      </div>
    )}

    <div
      className={cn(
        "w-full p-6 gap-8 relative",
        imagePosition === "center"
          ? "flex flex-col container-narrow"
          : "grid lg:grid-cols-2 max-w-7xl mx-auto items-center",
        textPosition === "center" ? "items-center" : "items-start",
        innerClassName,
      )}
      style={{ minHeight }}
    >
      <CtaContent
        className={cn("relative z-10", imagePosition === "left" && "lg:col-start-2 lg:row-start-1")}
        title={title}
        titleComponent={titleComponent}
        description={description}
        descriptionComponent={descriptionComponent}
        textPosition={textPosition}
        leadingComponent={leadingComponent}
      >
        {children}
      </CtaContent>

      {imageSrc && (
        <>
          {imagePosition === "center" && (
            <section className="w-full mt-6 md:mt-8">
              <img
                className={cn(
                  "w-full rounded-md overflow-hidden",
                  imageShadow === "soft" && "shadow-md",
                  imageShadow === "hard" && "shadow-[0px_29px_52px_0px_rgba(0,0,0,0.4)]",
                )}
                src={imageSrc}
                alt={imageAlt}
                width={1000}
                height={1000}
              />
            </section>
          )}
          {(imagePosition === "left" || imagePosition === "right") && (
            <img
              className={cn(
                "w-full rounded-md relative z-10 transition-all hover:scale-[1.02]",
                imageShadow === "soft" && "shadow-md",
                imageShadow === "hard" && "shadow-[0px_29px_52px_0px_rgba(0,0,0,0.4)]",
                imagePosition === "left" && "lg:-left-6",
                imagePosition === "right" && "lg:-right-6",
                imagePerspective !== "none" ? "my-8" : "my-4",
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

    {footerComponent}
  </section>
);

// ─── LandingPrimaryVideoCtaSection ─────────────────────────────────────────

/**
 * Primary CTA section with a video beside the text.
 *
 * Identical layout options as `LandingPrimaryImageCtaSection` but renders a
 * `<video>` element. Supports `autoPlay`, `controls`, `loop`, `muted`.
 */
export const LandingPrimaryVideoCtaSection = ({
  children,
  className,
  innerClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  leadingComponent,
  footerComponent,
  textPosition = "left",
  videoSrc,
  videoPoster,
  videoPosition = "right",
  videoShadow = "hard",
  muted = true,
  autoPlay = false,
  controls = false,
  loop = false,
  minHeight = 350,
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
  effectComponent,
  effectClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  leadingComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  textPosition?: "center" | "left";
  videoSrc?: string;
  videoPoster?: string;
  videoPosition?: "left" | "right" | "center";
  videoShadow?: "none" | "soft" | "hard";
  muted?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  minHeight?: number;
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
  effectComponent?: React.ReactNode;
  effectClassName?: string;
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
    {effectComponent && (
      <FadeMask
        className={cn("absolute inset-0 h-full w-full pointer-events-none opacity-50", effectClassName)}
        fadeHeight="4rem"
        aria-hidden="true"
      >
        {effectComponent}
      </FadeMask>
    )}

    <div
      className={cn(
        "w-full p-6 flex flex-col gap-8 relative z-10",
        videoPosition === "center"
          ? "max-w-3xl mx-auto"
          : "max-w-7xl mx-auto grid lg:grid-cols-2 items-center",
        textPosition === "center" ? "items-center" : "items-start",
        innerClassName,
      )}
      style={{ minHeight }}
    >
      {withBackgroundGlow && (
        <div className="hidden lg:flex justify-center w-full h-full absolute pointer-events-none">
          <GlowBg
            className="w-full lg:w-1/2 h-auto z-0 dark:opacity-50 -top-1/3"
            variant={backgroundGlowVariant}
          />
        </div>
      )}

      <CtaContent
        className={cn("relative z-10", videoPosition === "left" && "lg:col-start-2 lg:row-start-1")}
        title={title}
        titleComponent={titleComponent}
        description={description}
        descriptionComponent={descriptionComponent}
        textPosition={textPosition}
        leadingComponent={leadingComponent}
      >
        {children}
      </CtaContent>

      {videoSrc && (
        <video
          className={cn(
            "w-full rounded-md overflow-hidden",
            videoShadow === "soft" && "shadow-md",
            videoShadow === "hard" && "shadow-[0px_29px_52px_0px_rgba(0,0,0,0.4)]",
          )}
          src={videoSrc}
          poster={videoPoster}
          autoPlay={autoPlay}
          controls={controls}
          loop={loop}
          muted={muted}
          playsInline
        />
      )}
    </div>

    {footerComponent}
  </section>
);

// ─── LandingPrimaryTextCtaSection ──────────────────────────────────────────

/**
 * Primary CTA section — text only, no image or video.
 *
 * Centered or left-aligned layout. Use for bold hero headlines with CTA buttons.
 * Supports `leadingComponent` (pill/badge), `footerComponent`, optional background glow.
 */
export const LandingPrimaryTextCtaSection = ({
  children,
  className,
  innerClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  leadingComponent,
  footerComponent,
  textPosition = "center",
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
  effectComponent,
  effectClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  leadingComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  textPosition?: "center" | "left";
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
  effectComponent?: React.ReactNode;
  effectClassName?: string;
}) => (
  <section
    className={cn(
      "relative w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16",
      withBackground && variant === "primary" ? "bg-primary/5 dark:bg-primary/10" : "",
      withBackground && variant === "secondary" ? "bg-secondary/5 dark:bg-secondary/10" : "",
      className,
    )}
  >
    {effectComponent && (
      <FadeMask
        className={cn("absolute inset-0 h-full w-full pointer-events-none opacity-50", effectClassName)}
        fadeHeight="4rem"
        aria-hidden="true"
      >
        {effectComponent}
      </FadeMask>
    )}

    {withBackgroundGlow && (
      <div className="hidden lg:flex justify-center w-full h-full absolute pointer-events-none">
        <GlowBg
          className={cn("w-full lg:w-1/2 h-auto z-0 dark:opacity-50", textPosition === "center" ? "top-5" : "-top-1/3")}
          variant={backgroundGlowVariant}
        />
      </div>
    )}

    <div
      className={cn(
        "w-full p-6 flex flex-col gap-8 relative z-10",
        textPosition === "center" ? "max-w-3xl mx-auto" : "max-w-7xl mx-auto",
        textPosition === "center" ? "items-center" : "items-start",
        innerClassName,
      )}
    >
      <CtaContent
        className={cn(textPosition === "center" ? "items-center" : "items-start")}
        childrenClassName={cn(textPosition === "center" ? "items-center" : "")}
        title={title}
        titleComponent={titleComponent}
        description={description}
        descriptionComponent={descriptionComponent}
        textPosition={textPosition}
        leadingComponent={leadingComponent}
      >
        {children}
      </CtaContent>
    </div>

    {footerComponent}
  </section>
);
