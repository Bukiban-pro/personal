"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface VideoHeroProps {
  /** Video source URL */
  src: string
  /** Poster image */
  poster?: string
  /** Overlay content (title, CTA, etc.) */
  children?: React.ReactNode
  /** Overlay darkness (0-1, default 0.4) */
  overlayOpacity?: number
  /** Content vertical alignment */
  align?: "center" | "bottom" | "top"
  /** Fallback image for touch devices (saves bandwidth) */
  fallbackImage?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Fullscreen video background hero with overlay content.
 * Auto-plays muted, loops, with dark overlay for text readability.
 * Falls back to poster/image on touch devices. The Netflix/Apple premiere pattern.
 *
 * @example
 * <VideoHero
 *   src="/hero-loop.mp4"
 *   poster="/hero-poster.jpg"
 * >
 *   <h1 className="text-6xl font-bold text-white">Welcome</h1>
 *   <p className="text-xl text-white/80 mt-4">Experience the future</p>
 *   <Button variant="outline" size="lg" className="mt-8">
 *     Explore
 *   </Button>
 * </VideoHero>
 */
export function VideoHero({
  src,
  poster,
  children,
  overlayOpacity = 0.4,
  align = "center",
  fallbackImage,
  className,
}: VideoHeroProps) {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const alignClass = {
    center: "items-center justify-center",
    bottom: "items-end justify-center pb-24",
    top: "items-start justify-center pt-32",
  }

  return (
    <section
      className={cn(
        "relative flex min-h-screen overflow-hidden bg-black",
        alignClass[align],
        className,
      )}
    >
      {/* Video or fallback image */}
      {isTouchDevice && fallbackImage ? (
        <img
          src={fallbackImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
          aria-hidden
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="absolute inset-0 size-full object-cover"
          aria-hidden
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
        aria-hidden
      />

      {/* Content */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          {children}
        </motion.div>
      )}
    </section>
  )
}
