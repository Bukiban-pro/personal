"use client"

import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface Logo {
  name: string
  src: string
  href?: string
  width?: number
}

interface LogoCloudProps {
  logos: Logo[]
  title?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function LogoCloud({
  logos,
  title = "Trusted by leading companies",
  className,
}: LogoCloudProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {title}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
          {logos.map((logo) => {
            const Img = (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                width={logo.width ?? 120}
                className="h-8 w-auto object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0 dark:invert"
              />
            )

            return logo.href ? (
              <a
                key={logo.name}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                {Img}
              </a>
            ) : (
              <div key={logo.name} className="shrink-0">
                {Img}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
