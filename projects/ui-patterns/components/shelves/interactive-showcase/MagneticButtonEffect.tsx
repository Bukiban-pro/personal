import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Magnetic Button** — button that attracts cursor on hover
 *
 * Supports:
 * - Cursor tracking magnetic pull
 * - Spring physics follow
 * - Configurable pull distance
 * - Scale on hover
 *
 * Use: CTA buttons, interactive elements, premium UX
 */

export interface MagneticButtonEffectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pullDistance?: number;
  children: React.ReactNode;
}

export const MagneticButtonEffect = React.forwardRef<HTMLButtonElement, MagneticButtonEffectProps>(
  (
    {
      pullDistance = 100,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);

      if (distance < pullDistance) {
        const pullRatio = 1 - distance / pullDistance;
        setPosition({
          x: x * pullRatio * 0.5,
          y: y * pullRatio * 0.5,
        });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all",
          "hover:scale-110",
          className,
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

MagneticButtonEffect.displayName = "MagneticButtonEffect";
