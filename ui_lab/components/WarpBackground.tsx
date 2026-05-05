/**
 * WarpBackground
 * 3D perspective-projected grid with animated colorful beams shooting in from all
 * four sides. Creates a futuristic "warp speed" or "hyperspace" card backdrop.
 *
 * Deps: motion/react
 * Usage:
 *   <WarpBackground className="min-h-[400px]">
 *     <h1>Your content</h1>
 *   </WarpBackground>
 */
"use client"

import React, { HTMLAttributes, useCallback, useMemo } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  perspective?: number
  beamsPerSide?: number
  beamSize?: number
  beamDelayMax?: number
  beamDelayMin?: number
  beamDuration?: number
  gridColor?: string
}

const Beam = ({
  width,
  x,
  delay,
  duration,
}: {
  width: string | number
  x: string | number
  delay: number
  duration: number
}) => {
  const hue = Math.floor(Math.random() * 360)
  const ar = Math.floor(Math.random() * 10) + 1

  return (
    <motion.div
      style={
        {
          "--x": `${x}`,
          "--width": `${width}`,
          "--aspect-ratio": `${ar}`,
          "--background": `linear-gradient(hsl(${hue} 80% 60%), transparent)`,
        } as React.CSSProperties
      }
      className="absolute top-0 left-(--x) aspect-[1/var(--aspect-ratio)] w-(--width) [background:var(--background)]"
      initial={{ y: "100cqmax", x: "-50%" }}
      animate={{ y: "-100%", x: "-50%" }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  )
}

export const WarpBackground: React.FC<WarpBackgroundProps> = ({
  children,
  perspective = 100,
  className,
  beamsPerSide = 3,
  beamSize = 5,
  beamDelayMax = 3,
  beamDelayMin = 0,
  beamDuration = 3,
  gridColor = "var(--border)",
  ...props
}) => {
  const generateBeams = useCallback(() => {
    const beams = []
    const cellsPerSide = Math.floor(100 / beamSize)
    const step = cellsPerSide / beamsPerSide

    for (let i = 0; i < beamsPerSide; i++) {
      const x = Math.floor(i * step)
      const delay = Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin
      beams.push({ x, delay })
    }
    return beams
  }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin])

  const topBeams = useMemo(() => generateBeams(), [generateBeams])
  const rightBeams = useMemo(() => generateBeams(), [generateBeams])
  const bottomBeams = useMemo(() => generateBeams(), [generateBeams])
  const leftBeams = useMemo(() => generateBeams(), [generateBeams])

  const gridStyle = {
    "--perspective": `${perspective}px`,
    "--grid-color": gridColor,
    "--beam-size": `${beamSize}%`,
  } as React.CSSProperties

  const gridBg =
    "[background:linear-gradient(var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,var(--grid-color)_0_1px,transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)]"

  return (
    <div className={cn("relative rounded border p-20", className)} {...props}>
      <div
        style={gridStyle}
        className="@container-[size] pointer-events-none absolute top-0 left-0 size-full overflow-hidden [clipPath:inset(0)] perspective-(--perspective) transform-3d"
      >
        {/* top */}
        <div
          className={cn(
            "@container absolute z-20 h-[100cqmax] w-[100cqi] origin-[50%_0%] transform-[rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] transform-3d",
            gridBg
          )}
        >
          {topBeams.map((beam, i) => (
            <Beam key={`top-${i}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delay={beam.delay} duration={beamDuration} />
          ))}
        </div>
        {/* bottom */}
        <div
          className={cn(
            "@container absolute top-full h-[100cqmax] w-[100cqi] origin-[50%_0%] transform-[rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] transform-3d",
            gridBg
          )}
        >
          {bottomBeams.map((beam, i) => (
            <Beam key={`bottom-${i}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delay={beam.delay} duration={beamDuration} />
          ))}
        </div>
        {/* left */}
        <div
          className={cn(
            "@container absolute top-0 left-0 h-[100cqmax] w-[100cqh] origin-[0%_0%] transform-[rotate(90deg)_rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] transform-3d",
            gridBg
          )}
        >
          {leftBeams.map((beam, i) => (
            <Beam key={`left-${i}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delay={beam.delay} duration={beamDuration} />
          ))}
        </div>
        {/* right */}
        <div
          className={cn(
            "@container absolute top-0 right-0 h-[100cqmax] w-[100cqh] origin-[100%_0%] transform-[rotate(-90deg)_rotateX(-90deg)] bg-size-[var(--beam-size)_var(--beam-size)] transform-3d",
            gridBg
          )}
        >
          {rightBeams.map((beam, i) => (
            <Beam key={`right-${i}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delay={beam.delay} duration={beamDuration} />
          ))}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
