import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Motion Blur / Velocity Blur Effect** — blur applied during scroll movement
 *
 * Supports:
 * - Velocity-based blur intensity
 * - Customizable blur amount
 * - Performance optimization
 * - Easing animation
 *
 * Use: High-speed animations, scroll effects, motion design
 */

export interface MotionBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  blurIntensity?: number;
  children: React.ReactNode;
}

export const MotionBlur = React.forwardRef<HTMLDivElement, MotionBlurProps>(
  (
    {
      blurIntensity = 10,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [blur, setBlur] = React.useState(0);
    const lastScrollRef = React.useRef(0);
    const animationRef = React.useRef<number>();

    React.useEffect(() => {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            const velocity = Math.abs(currentScroll - lastScrollRef.current);
            const newBlur = Math.min(velocity * blurIntensity * 0.01, blurIntensity);

            setBlur(newBlur);
            lastScrollRef.current = currentScroll;

            // Decay blur over time
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            animationRef.current = window.requestAnimationFrame(() => {
              setBlur((prev) => prev * 0.95);
            });

            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }, [blurIntensity]);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          filter: `blur(${blur}px)`,
          transition: "filter 0.1s ease-out",
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MotionBlur.displayName = "MotionBlur";
