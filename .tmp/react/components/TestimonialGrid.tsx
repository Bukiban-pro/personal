"use client"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

// ── Types ──────────────────────────────────────────────────────────────
interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
  avatarUrl?: string
  rating?: number // 1-5
}

interface TestimonialGridProps {
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
  columns?: 2 | 3
  className?: string
}

// ── Sub-components ─────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn(
            "size-4",
            i < count ? "fill-[var(--color-warning,#eab308)] text-[var(--color-warning,#eab308)]" : "fill-muted text-muted",
          )}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────
export function TestimonialGrid({
  testimonials,
  title = "What our customers say",
  subtitle,
  columns = 3,
  className,
}: TestimonialGridProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Grid — masonry-like via column layout */}
        <div
          className={cn(
            "mx-auto mt-12 columns-1 gap-6 space-y-6",
            columns === 2 && "sm:columns-2",
            columns === 3 && "sm:columns-2 lg:columns-3",
          )}
        >
          {testimonials.map((t, i) => (
            <Card key={i} className="break-inside-avoid">
              <CardContent className="p-6">
                {t.rating && <Stars count={t.rating} />}
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.author}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{t.author}</p>
                    {(t.role || t.company) && (
                      <p className="text-xs text-muted-foreground">
                        {[t.role, t.company].filter(Boolean).join(" at ")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
