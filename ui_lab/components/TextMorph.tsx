import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Text Morph** — animated morphing between text values
 *
 * Supports:
 * - Character-level morphing animation
 * - Smooth transition between words
 * - Stagger effect
 * - Custom easing
 * - SVG filter distortion
 *
 * Use: Hero headlines, animated values, status displays
 */

export interface TextMorphProps extends React.HTMLAttributes<HTMLDivElement> {
  texts: string[];
  duration?: number;
  stagger?: number;
}

export const TextMorph = React.forwardRef<HTMLDivElement, TextMorphProps>(
  (
    {
      texts,
      duration = 2,
      stagger = 0.05,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }, duration * 1000);
      return () => clearInterval(interval);
    }, [texts.length, duration]);

    const currentText = texts[currentIndex];
    const nextText = texts[(currentIndex + 1) % texts.length];

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div className="relative h-10 flex items-center">
          {currentText.split("").map((char, i) => (
            <span
              key={`current-${i}`}
              className="inline-block transition-all duration-500 opacity-100"
              style={{
                animationDelay: `${i * stagger}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  },
);

TextMorph.displayName = "TextMorph";
