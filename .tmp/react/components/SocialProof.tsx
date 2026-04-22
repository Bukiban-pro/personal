"use client"

import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────
interface SocialProofProps {
  /** Total user count, e.g. "10,000+" */
  count: string
  /** Label, e.g. "happy customers" */
  label: string
  /** Avatar URLs for the stacked avatar display */
  avatars?: string[]
  /** Star rating (1-5) */
  rating?: number
  /** Rating label, e.g. "4.9/5 from 500+ reviews" */
  ratingLabel?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function SocialProof({
  count,
  label,
  avatars = [],
  rating,
  ratingLabel,
  className,
}: SocialProofProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 sm:flex-row sm:gap-6",
        className,
      )}
    >
      {/* Stacked avatars */}
      {avatars.length > 0 && (
        <div className="flex -space-x-3">
          {avatars.slice(0, 5).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="size-10 rounded-full border-2 border-background object-cover"
            />
          ))}
          {avatars.length > 5 && (
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
              +{avatars.length - 5}
            </div>
          )}
        </div>
      )}

      {/* Text */}
      <div className="text-center sm:text-left">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{count}</span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>

        {/* Rating */}
        {rating && (
          <div className="mt-1 flex items-center gap-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < Math.round(rating)
                      ? "fill-[var(--color-warning,#eab308)] text-[var(--color-warning,#eab308)]"
                      : "fill-muted text-muted",
                  )}
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {ratingLabel && (
              <span className="text-xs text-muted-foreground">
                {ratingLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
