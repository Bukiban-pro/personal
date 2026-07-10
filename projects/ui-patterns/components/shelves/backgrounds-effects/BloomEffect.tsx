import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Bloom / Glow Effect** — soft blur and glow radiating outward
 *
 * Supports:
 * - Configurable blur radius
 * - Color intensity control
 * - Layer compositing
 * - Animated intensity
 *
 * Use: Premium backgrounds, visual emphasis, luxury effects
 */

export interface BloomEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  intensity?: number;
  blurRadius?: number;
  children: React.ReactNode;
}

export const BloomEffect = React.forwardRef<HTMLDivElement, BloomEffectProps>(
  (
    {
      color = "#06b6d4",
      intensity = 0.5,
      blurRadius = 100,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-visible", className)}
        {...props}
      >
        {/* Bloom glow layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${color}${Math.round(intensity * 100).toString(16).padStart(2, '0')}, transparent 70%)`,
            filter: `blur(${blurRadius}px)`,
            mixBlendMode: "screen",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        <style>{`
          @keyframes bloom-pulse {
            0%, 100% { opacity: ${intensity}; }
            50% { opacity: ${intensity * 0.5}; }
          }
          
          .bloom-animated {
            animation: bloom-pulse 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  },
);

BloomEffect.displayName = "BloomEffect";
