"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Props ──────────────────────────────────────────────────────────────
interface ScrollVideoPlayerProps {
  /** Video source URL */
  src: string
  /** How tall the scroll container is in vh (default 5 = 500vh) */
  scrollLength?: number
  /** Poster image shown before video loads */
  poster?: string
  className?: string
  containerClassName?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * Apple-style video that scrubs with scroll position.
 * The video frame advances forward/backward as the user scrolls.
 * Used for product reveal sequences, explainer animations, etc.
 *
 * @example
 * <ScrollVideoPlayer
 *   src="/product-reveal.mp4"
 *   scrollLength={6}
 *   poster="/product-poster.jpg"
 * />
 */
export function ScrollVideoPlayer({
  src,
  scrollLength = 5,
  poster,
  className,
  containerClassName,
}: ScrollVideoPlayerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Map scroll progress to video currentTime
  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (video.duration && Number.isFinite(video.duration)) {
        video.currentTime = progress * video.duration
      }
    })

    return unsubscribe
  }, [scrollYProgress])

  // Opacity: fade in at start, fade out at end
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0],
  )

  return (
    <div
      ref={containerRef}
      className={cn("relative", containerClassName)}
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          style={{ opacity }}
          className={cn("size-full object-cover", className)}
        />
      </div>
    </div>
  )
}
