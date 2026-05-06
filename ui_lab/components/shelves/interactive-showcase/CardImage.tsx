import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Card Variants** — flexible card layouts with image, content, footer
 *
 * Supports:
 * - Image-top variant
 * - Image-overlay variant
 * - Horizontal layout
 * - Gradient overlay on images
 * - Multiple footer actions
 *
 * Use: Blog posts, products, team members, portfolio items
 */

export interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description?: string;
  badge?: { label: string; variant?: string };
  footer?: React.ReactNode;
  variant?: "top" | "overlay" | "horizontal";
  size?: "sm" | "md" | "lg";
}

export const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  (
    {
      image,
      title,
      description,
      badge,
      footer,
      variant = "top",
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    const sizeMap = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
    };

    if (variant === "horizontal") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex overflow-hidden rounded-lg border border-border bg-background",
            sizeMap[size],
            className,
          )}
          {...props}
        >
          {/* Image */}
          <img
            src={image.src}
            alt={image.alt}
            className="w-32 h-full object-cover"
          />

          {/* Content */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{title}</h3>
              {badge && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {badge.label}
                </span>
              )}
            </div>

            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}

            {footer && <div className="mt-auto pt-2 border-t border-border/50">{footer}</div>}
          </div>
        </div>
      );
    }

    if (variant === "overlay") {
      return (
        <div
          ref={ref}
          className={cn(
            "relative rounded-lg overflow-hidden",
            sizeMap[size],
            className,
          )}
          {...props}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-48 object-cover"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{title}</h3>
                {description && (
                  <p className="text-xs text-white/80 mt-0.5">{description}</p>
                )}
              </div>
              {badge && (
                <span className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                  {badge.label}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default: top variant
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-background",
          sizeMap[size],
          className,
        )}
        {...props}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-40 bg-muted">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          {badge && (
            <div className="absolute top-2 right-2">
              <span className="text-xs bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-full">
                {badge.label}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {footer && <div className="pt-2 border-t border-border/50 mt-2">{footer}</div>}
        </div>
      </div>
    );
  },
);

CardImage.displayName = "CardImage";
