"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

// ── Props ──────────────────────────────────────────────────────────────
interface GlitchTextProps {
  /** Text to display */
  text: string
  /** Glitch intensity (1-3, default 2) */
  intensity?: 1 | 2 | 3
  /** Glitch on hover only (default false = always) */
  hoverOnly?: boolean
  /** Tag */
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Glitch/CRT distortion text effect.
 * Double text layers with offset clip-paths that jitter.
 * The cyberpunk/dark-UI text effect from creative portfolios.
 *
 * @example
 * <GlitchText text="SYSTEM ERROR" className="text-5xl font-bold" />
 * <GlitchText text="Hover me" hoverOnly intensity={3} as="h2" />
 */
export function GlitchText({
  text,
  intensity = 2,
  hoverOnly = false,
  as: Tag = "span",
  className,
}: GlitchTextProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>
  }

  const dur = {
    1: "1.5s",
    2: "0.8s",
    3: "0.4s",
  }

  return (
    <Tag
      className={cn(
        "relative inline-block",
        hoverOnly ? "glitch-hover" : "glitch-always",
        className,
      )}
      data-text={text}
      aria-label={text}
      style={
        {
          "--glitch-duration": dur[intensity],
        } as React.CSSProperties
      }
    >
      {text}
    </Tag>
  )
}

/* Required CSS (add to globals.css):

.glitch-always,
.glitch-hover:hover {
  animation: none;
}

.glitch-always::before,
.glitch-always::after,
.glitch-hover:hover::before,
.glitch-hover:hover::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-always::before,
.glitch-hover:hover::before {
  animation: glitch-top var(--glitch-duration, 0.8s) linear infinite;
  clip-path: inset(0 0 50% 0);
  color: oklch(from var(--primary) l c h);
}

.glitch-always::after,
.glitch-hover:hover::after {
  animation: glitch-bottom var(--glitch-duration, 0.8s) linear infinite;
  clip-path: inset(50% 0 0 0);
  color: oklch(from var(--destructive) l c h);
}

@keyframes glitch-top {
  0%   { transform: translate(0); }
  20%  { transform: translate(-3px, -2px); }
  40%  { transform: translate(3px, 2px); }
  60%  { transform: translate(-2px, 1px); }
  80%  { transform: translate(2px, -1px); }
  100% { transform: translate(0); }
}

@keyframes glitch-bottom {
  0%   { transform: translate(0); }
  20%  { transform: translate(3px, 1px); }
  40%  { transform: translate(-3px, -1px); }
  60%  { transform: translate(2px, 2px); }
  80%  { transform: translate(-2px, -2px); }
  100% { transform: translate(0); }
}
*/
