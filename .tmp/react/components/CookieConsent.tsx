"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface CookieConsentProps {
  /** Callback when user accepts */
  onAccept?: () => void
  /** Callback when user rejects */
  onReject?: () => void
  /** Persist choice to localStorage key */
  storageKey?: string
  /** Position on screen */
  position?: "bottom" | "bottom-left" | "bottom-right"
  /** Custom message */
  message?: string
  /** Link to privacy policy */
  privacyHref?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function CookieConsent({
  onAccept,
  onReject,
  storageKey = "cookie-consent",
  position = "bottom",
  message = "We use cookies to improve your experience. By continuing, you agree to our use of cookies.",
  privacyHref,
  className,
}: CookieConsentProps) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (!stored) setVisible(true)
  }, [storageKey])

  const handleAccept = () => {
    localStorage.setItem(storageKey, "accepted")
    setVisible(false)
    onAccept?.()
  }

  const handleReject = () => {
    localStorage.setItem(storageKey, "rejected")
    setVisible(false)
    onReject?.()
  }

  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-300",
        position === "bottom" && "inset-x-0 bottom-0 px-4 pb-4",
        position === "bottom-left" && "bottom-4 left-4",
        position === "bottom-right" && "bottom-4 right-4",
        className,
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        className={cn(
          "rounded-lg border bg-background p-4 shadow-lg",
          position === "bottom" && "mx-auto max-w-4xl",
          (position === "bottom-left" || position === "bottom-right") &&
            "max-w-sm",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {message}
              {privacyHref && (
                <>
                  {" "}
                  <a
                    href={privacyHref}
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </>
              )}
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={handleAccept}>
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={handleReject}>
                Decline
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReject}
            className="rounded-sm p-1 opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
