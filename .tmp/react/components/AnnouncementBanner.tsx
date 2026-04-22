"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface AnnouncementBannerProps {
  message: string
  href?: string
  linkText?: string
  dismissible?: boolean
  variant?: "default" | "gradient" | "accent"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function AnnouncementBanner({
  message,
  href,
  linkText = "Learn more →",
  dismissible = true,
  variant = "default",
  className,
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = React.useState(false)

  if (dismissed) return null

  return (
    <div
      className={cn(
        "relative flex items-center justify-center gap-2 px-4 py-2.5 text-sm",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "gradient" &&
          "bg-gradient-to-r from-primary via-primary/80 to-primary text-primary-foreground",
        variant === "accent" && "bg-accent text-accent-foreground",
        className,
      )}
    >
      <p className="text-center">
        {message}
        {href && (
          <>
            {" "}
            <a
              href={href}
              className="inline-flex items-center font-semibold underline underline-offset-4 hover:no-underline"
            >
              {linkText}
            </a>
          </>
        )}
      </p>

      {dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
