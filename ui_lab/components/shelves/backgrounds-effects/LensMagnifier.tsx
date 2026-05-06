import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Lens / Magnifier Component** — magnifying glass effect over content
 *
 * Supports:
 * - Mouse-tracked zoom region
 * - Customizable magnification
 * - Border ring styling
 * - Content preview inside lens
 *
 * Use: Product showcases, detailed inspections, focus effects
 */

export interface LensComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  magnification?: number;
  size?: number;
  children: React.ReactNode;
}

export const LensComponent = React.forwardRef<HTMLDivElement, LensComponentProps>(
  (
    {
      magnification = 2,
      size = 150,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}

        {/* Lens circle */}
        {isActive && (
          <div
            className="fixed pointer-events-none border-2 border-primary rounded-full z-50"
            style={{
              width: size,
              height: size,
              left: position.x - size / 2,
              top: position.y - size / 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                transform: `scale(${magnification}) translate(${-(position.x - size / 2) / magnification}px, ${-(position.y - size / 2) / magnification}px)`,
              }}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    );
  },
);

LensComponent.displayName = "LensComponent";
