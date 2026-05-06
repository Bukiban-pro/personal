import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Aurora Background** — animated gradient aurora/aurora-borealis effect
 *
 * Supports:
 * - Animated gradient blobs
 * - Multiple colors
 * - Blur effect
 * - Responsive sizing
 *
 * Use: Hero backgrounds, landing pages, premium sections
 */

export interface AuroraBackgroundEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  blur?: number;
  speed?: number;
}

export const AuroraBackgroundEffect = React.forwardRef<HTMLDivElement, AuroraBackgroundEffectProps>(
  (
    {
      colors = ["#ff0080", "#7928ca", "#1e3a8a"],
      blur = 100,
      speed = 8,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Animated gradient blobs */}
        <style>{`
          @keyframes aurora {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(20px, -30px) scale(1.1);
            }
            50% {
              transform: translate(-20px, 30px) scale(0.9);
            }
            75% {
              transform: translate(-30px, -20px) scale(1.05);
            }
          }
          
          .aurora-blob {
            animation: aurora ${speed}s ease-in-out infinite;
          }
        `}</style>

        <div className="absolute inset-0 overflow-hidden">
          {colors.map((color, i) => (
            <div
              key={i}
              className="aurora-blob absolute rounded-full"
              style={{
                width: `${300 + i * 100}px`,
                height: `${300 + i * 100}px`,
                background: color,
                filter: `blur(${blur}px)`,
                opacity: 0.3 - i * 0.1,
                left: `${30 * i}%`,
                top: `${20 * i}%`,
                animationDelay: `${i * speed * 0.25}s`,
                mixBlendMode: "screen",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);

AuroraBackgroundEffect.displayName = "AuroraBackgroundEffect";
