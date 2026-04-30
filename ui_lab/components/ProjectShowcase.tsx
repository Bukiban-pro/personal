"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ExternalLink, Github } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl?: string
  sourceUrl?: string
}

interface ProjectShowcaseProps {
  projects: Project[]
  /** Grid columns (default: auto-fit) */
  columns?: 2 | 3
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Project gallery grid with hover overlay and staggered entrance.
 * The universal portfolio project section — works for any showcase.
 *
 * @example
 * <ProjectShowcase
 *   projects={[
 *     {
 *       title: "My App",
 *       description: "A cool app",
 *       image: "/project.jpg",
 *       tags: ["React", "TypeScript"],
 *       liveUrl: "https://...",
 *       sourceUrl: "https://github.com/...",
 *     },
 *   ]}
 * />
 */
export function ProjectShowcase({ projects, columns, className }: ProjectShowcaseProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2
          ? "grid-cols-1 md:grid-cols-2"
          : columns === 3
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {projects.map((project, i) => (
        <motion.article
          key={project.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="group relative overflow-hidden rounded-xl border border-border bg-card"
        >
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                  aria-label={`View ${project.title} live`}
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform hover:scale-110"
                  aria-label={`View ${project.title} source`}
                >
                  <Github className="size-4" />
                </a>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
