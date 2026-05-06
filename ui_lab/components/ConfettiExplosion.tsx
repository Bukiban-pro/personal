import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Confetti Explosion** — particle system for celebration effects
 *
 * Supports:
 * - Emoji/text particles
 * - Gravity simulation
 * - Randomized trajectories
 * - Trigger on click/interaction
 *
 * Use: Success states, celebrations, gamification
 */

export interface ConfettiProps extends React.HTMLAttributes<HTMLDivElement> {
  particles?: string[];
  count?: number;
  trigger?: "click" | "mount";
  gravity?: number;
}

export const Confetti = React.forwardRef<HTMLDivElement, ConfettiProps>(
  (
    {
      particles = ["🎉", "🎊", "✨", "🎈"],
      count = 50,
      trigger = "click",
      gravity = 0.15,
      className,
      ...props
    },
    ref,
  ) => {
    const [activeParticles, setActiveParticles] = React.useState<
      Array<{
        id: string;
        particle: string;
        x: number;
        y: number;
        vx: number;
        vy: number;
      }>
    >([]);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const createConfetti = () => {
      const newParticles = Array.from({ length: count }, (_, i) => {
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 5 + Math.random() * 10;

        return {
          id: Math.random().toString(36),
          particle: particles[Math.floor(Math.random() * particles.length)],
          x: Math.random() * 100,
          y: 0,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
        };
      });

      setActiveParticles(newParticles);

      // Animate and remove particles
      let frameCount = 0;
      const maxFrames = 120;

      const animate = () => {
        frameCount++;

        if (frameCount < maxFrames) {
          setActiveParticles((prev) =>
            prev.map((p) => ({
              ...p,
              y: p.y + p.vy,
              vy: p.vy + gravity,
              x: p.x + p.vx,
              vx: p.vx * 0.99, // Air resistance
            })),
          );
          requestAnimationFrame(animate);
        } else {
          setActiveParticles([]);
        }
      };

      requestAnimationFrame(animate);
    };

    React.useEffect(() => {
      if (trigger === "mount") {
        createConfetti();
      }
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn("fixed inset-0 pointer-events-none", className)}
        onClick={() => trigger === "click" && createConfetti()}
        {...props}
      >
        {activeParticles.map((p) => (
          <div
            key={p.id}
            className="absolute text-2xl"
            style={{
              left: `${p.x}%`,
              top: `${p.y}px`,
              opacity: Math.max(0, 1 - p.y / 400),
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {p.particle}
          </div>
        ))}
      </div>
    );
  },
);

Confetti.displayName = "Confetti";
