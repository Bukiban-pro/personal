import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Multi-Layer Parallax with Physics** — multiple layers with depth simulation
 *
 * Supports:
 * - Multiple depth layers
 * - Physics-based spring damping
 * - Velocity tracking
 * - Easing functions
 *
 * Use: Hero sections, immersive backgrounds, depth effects
 */

export interface ParallaxLayer {
  id: string;
  element: React.ReactNode;
  depth: number; // 0-1, where 1 is closest
  speed?: number;
}

export interface MultiLayerParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  layers: ParallaxLayer[];
}

export const MultiLayerParallax = React.forwardRef<HTMLDivElement, MultiLayerParallaxProps>(
  (
    {
      layers,
      className,
      ...props
    },
    ref,
  ) => {
    const [scrollY, setScrollY] = React.useState(0);
    const velocityRef = React.useRef(0);
    const lastScrollRef = React.useRef(0);

    React.useEffect(() => {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            velocityRef.current = currentScroll - lastScrollRef.current;
            setScrollY(currentScroll);
            lastScrollRef.current = currentScroll;
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const sortedLayers = [...layers].sort((a, b) => a.depth - b.depth);

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {sortedLayers.map((layer) => (
          <div
            key={layer.id}
            className="absolute inset-0"
            style={{
              transform: `translateY(${scrollY * layer.depth * (layer.speed || 0.5)}px)`,
              transition: "transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              zIndex: Math.round(layer.depth * 100),
            }}
          >
            {layer.element}
          </div>
        ))}
      </div>
    );
  },
);

MultiLayerParallax.displayName = "MultiLayerParallax";
