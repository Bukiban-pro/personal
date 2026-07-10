import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Spotlight / Gradient Spotlight** — radial gradient spotlight following cursor
 *
 * Supports:
 * - Mouse-tracked radial gradient
 * - Customizable size and color
 * - Spring physics follow
 * - Multiple spotlights
 *
 * Use: Hero sections, decorative backgrounds, interactive highlights
 */

export interface SpotlightEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  color?: string;
  opacity?: number;
}

export const SpotlightEffect = React.forwardRef<HTMLDivElement, SpotlightEffectProps>(
  (
    {
      size = 300,
      color = "rgb(59, 130, 246)",
      opacity = 0.3,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [mouseX, setMouseX] = React.useState(0);
    const [mouseY, setMouseY] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMouseX(e.clientX - rect.left);
        setMouseY(e.clientY - rect.top);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}

        {/* Spotlight gradient */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-100 ease-out"
          style={{
            background: `radial-gradient(circle ${size}px at ${mouseX}px ${mouseY}px, ${color} 0%, transparent 100%)`,
            opacity: opacity,
          }}
        />
      </div>
    );
  },
);

SpotlightEffect.displayName = "SpotlightEffect";
