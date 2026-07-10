import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductVideoQuote
 * Video player mockup with an overlaid customer quote + attribution.
 * Pattern: Apple product cinema / social-proof video sections.
 */

export interface LandingProductVideoQuoteProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  /** URL of thumbnail image (or null for placeholder) */
  thumbnailSrc?: string;
  /** Video embed URL (YouTube nocookie, Vimeo, etc.) */
  videoSrc?: string;
  quote?: string;
  attribution?: string;
  role?: string;
  company?: string;
}

export const LandingProductVideoQuote = React.forwardRef<HTMLElement, LandingProductVideoQuoteProps>(
  (
    {
      className,
      title = "Hear it from the team",
      description = "Real stories from revenue leaders who've already made the switch.",
      thumbnailSrc,
      videoSrc,
      quote = "We replaced our Friday forecast spreadsheet marathon with a 20-minute live review. Our VP of Sales said it was the single biggest unlock of the quarter.",
      attribution = "Jordan Kim",
      role = "VP of Sales",
      company = "Acme Corp",
      ...props
    },
    ref,
  ) => {
    const [playing, setPlaying] = React.useState(false);

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3 text-center">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? (
                <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg">{description}</p>
              ) : null}
            </div>
          )}

          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            {/* Video area */}
            <div className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-zinc-900 shadow-xl shadow-black/20">
              {playing && videoSrc ? (
                <iframe
                  src={videoSrc}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                  title="Product video"
                />
              ) : (
                <>
                  {/* Thumbnail */}
                  {thumbnailSrc ? (
                    <img src={thumbnailSrc} alt="Video thumbnail" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Play button */}
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Play video"
                  >
                    <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5 fill-current">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Quote card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <blockquote className="flex flex-col gap-4">
                <svg viewBox="0 0 32 24" className="h-6 w-6 text-muted-foreground/50" fill="currentColor">
                  <path d="M0 24V14.4C0 6.4 5.6 1.2 11.2 0l1.6 2C9.2 3.2 6.8 6 6.4 9.6H12V24H0zm20 0V14.4C20 6.4 25.6 1.2 31.2 0l1.6 2C29.2 3.2 26.8 6 26.4 9.6H32V24H20z" />
                </svg>
                <p className="text-base leading-7 text-foreground md:text-lg">{quote}</p>
                <footer className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{attribution}</div>
                    <div className="text-xs text-muted-foreground">
                      {role}
                      {company ? ` · ${company}` : ""}
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductVideoQuote.displayName = "LandingProductVideoQuote";
