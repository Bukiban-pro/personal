import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **VHS Effect / CRT Screen Effect** — retro video tape distortion overlay
 *
 * Supports:
 * - Scan line effect
 * - Color channel misalignment
 * - Chromatic aberration
 * - Noise overlay
 * - Flicker animation
 *
 * Use: Retro aesthetics, 90s styling, creative projects
 */

export interface VHSEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: number;
  children: React.ReactNode;
}

export const VHSEffect = React.forwardRef<HTMLDivElement, VHSEffectProps>(
  (
    {
      intensity = 0.5,
      children,
      className,
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
        {children}

        {/* Scan lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='black' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            opacity: intensity * 0.3,
            mixBlendMode: "screen",
            animation: "vhs-noise 0.2s infinite",
          }}
        />

        {/* Chromatic aberration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `
              -2px 0 0 rgba(255, 0, 0, ${intensity * 0.2}),
              2px 0 0 rgba(0, 255, 255, ${intensity * 0.2})
            `,
            animation: `vhs-flicker ${0.1 / intensity}s infinite`,
          }}
        />

        <style>{`
          @keyframes vhs-noise {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-2px, -2px); }
            20% { transform: translate(-2px, 2px); }
            30% { transform: translate(2px, -2px); }
            40% { transform: translate(2px, 2px); }
            50% { transform: translate(0, 0); }
          }
          
          @keyframes vhs-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: ${1 - intensity * 0.2}; }
          }
        `}</style>
      </div>
    );
  },
);

VHSEffect.displayName = "VHSEffect";
