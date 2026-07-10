"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface Skill {
  name: string
  level: number // 0-100
  color?: string
}

interface SkillBarsProps {
  skills: Skill[]
  /** Show percentage label */
  showPercentage?: boolean
  /** Animation duration per bar (seconds) */
  duration?: number
  /** Bar height */
  barHeight?: "sm" | "md" | "lg"
  /** Default bar color (if skill has no custom color) */
  color?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Animated skill/progress bars that fill on scroll.
 * Universal "skills" section for portfolios and resumes.
 *
 * @example
 * <SkillBars
 *   skills={[
 *     { name: "React", level: 95 },
 *     { name: "TypeScript", level: 90 },
 *     { name: "Node.js", level: 80, color: "oklch(0.6 0.2 140)" },
 *   ]}
 *   showPercentage
 * />
 */
export function SkillBars({
  skills,
  showPercentage = true,
  duration = 1,
  barHeight = "md",
  color = "oklch(from var(--primary) l c h)",
  className,
}: SkillBarsProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" })

  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }

  return (
    <div ref={ref} className={cn("space-y-5", className)}>
      {skills.map((skill, i) => (
        <div key={skill.name}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{skill.name}</span>
            {showPercentage && (
              <span className="text-xs text-muted-foreground">{skill.level}%</span>
            )}
          </div>
          <div
            className={cn(
              "overflow-hidden rounded-full bg-secondary",
              heightClass[barHeight],
            )}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{
                duration,
                delay: i * 0.1,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="h-full rounded-full"
              style={{ backgroundColor: skill.color ?? color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
