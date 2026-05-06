import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Holographic Card** — shimmering holographic effect on card
 *
 * Supports:
 * - Gradient shift with mouse movement
 * - RGB channel separation effect
 * - Chromatic aberration overlay
 * - Rainbow iridescence
 *
 * Use: Premium card effects, luxury products, exclusive items
 */

export interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const HolographicCard = React.forwardRef<HTMLDivElement, HolographicCardProps>(
  (
    {
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    return (
      <div
        ref={cardRef}
        className={cn(
          "relative p-6 rounded-lg border border-border overflow-hidden group",
          className,
        )}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

        {/* Holographic shimmer overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* Chromatic aberration effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 0, 0.1), rgba(0, 0, 255, 0.1))`,
            mixBlendMode: "screen",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        <style>{`
          @keyframes holographic-shift {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(60deg); }
          }
          
          .holographic-card:hover {
            animation: holographic-shift 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  },
);

HolographicCard.displayName = "HolographicCard";
