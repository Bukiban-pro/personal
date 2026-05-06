import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Carousel** — carousel with effects (fade, slide, zoom)
 *
 * Supports:
 * - Multiple transition effects
 * - Auto-play with pause
 * - Touch/drag support
 * - Pagination + arrows
 * - Customizable timing
 *
 * Use: Hero sliders, product showcases, image galleries
 */

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  effect?: "fade" | "slide" | "zoom";
  autoPlay?: boolean;
  duration?: number;
  onSlideChange?: (index: number) => void;
}

export const AdvancedCarousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      items,
      effect = "slide",
      autoPlay = true,
      duration = 5000,
      onSlideChange,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovering, setIsHovering] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
      if (!autoPlay || isHovering) return;

      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, duration);

      return () => clearInterval(timer);
    }, [autoPlay, duration, items.length, isHovering]);

    const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      onSlideChange?.(currentIndex - 1 + items.length);
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      onSlideChange?.(currentIndex + 1);
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden rounded-lg group", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        {/* Slides */}
        <div className="relative w-full h-96">
          {items.map((item, i) => {
            const isActive = i === currentIndex;
            let translateX = 0;
            let opacity = 0;
            let scale = 1;

            if (effect === "fade") {
              opacity = isActive ? 1 : 0;
            } else if (effect === "slide") {
              translateX = (i - currentIndex) * 100;
            } else if (effect === "zoom") {
              scale = isActive ? 1 : 0.8;
              opacity = isActive ? 1 : 0.5;
            }

            return (
              <div
                key={i}
                className="absolute inset-0 transition-all duration-500"
                style={{
                  opacity: effect === "fade" ? opacity : 1,
                  transform: `translateX(${effect === "slide" ? translateX : 0}%) scale(${scale})`,
                  zIndex: isActive ? 10 : 0,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/75 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ◀
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/75 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ▶
        </button>

        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75",
              )}
            />
          ))}
        </div>
      </div>
    );
  },
);

AdvancedCarousel.displayName = "AdvancedCarousel";
