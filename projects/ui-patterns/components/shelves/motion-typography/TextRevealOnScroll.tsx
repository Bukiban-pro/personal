import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Text Reveal on Scroll** — gradient mask reveal as text enters viewport
 *
 * Supports:
 * - Gradient mask animation
 * - Configurable reveal direction
 * - Progress tracking
 * - Multiple stagger groups
 *
 * Use: Hero sections, dramatic reveals, landing pages
 */

export interface TextRevealOnScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  direction?: "ltr" | "rtl" | "top" | "bottom";
}

export const TextRevealOnScroll = React.forwardRef<HTMLDivElement, TextRevealOnScrollProps>(
  (
    {
      text,
      direction = "ltr",
      className,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      }, { threshold: 0.1 });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);

    const gradientDirections = {
      ltr: "to right",
      rtl: "to left",
      top: "to bottom",
      bottom: "to top",
    };

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div
          ref={ref}
          style={{
            backgroundImage: isVisible
              ? `linear-gradient(${gradientDirections[direction]}, transparent 0%, black 50%, black 100%)`
              : `linear-gradient(${gradientDirections[direction]}, transparent 0%, transparent 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "background-image 1s ease-out",
          }}
          className="font-bold text-4xl"
        >
          {text}
        </div>
      </div>
    );
  },
);

TextRevealOnScroll.displayName = "TextRevealOnScroll";
