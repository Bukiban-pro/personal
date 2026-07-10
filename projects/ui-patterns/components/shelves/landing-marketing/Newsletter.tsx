"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ── Types ──────────────────────────────────────────────────────────────
interface NewsletterProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  onSubmit?: (email: string) => void | Promise<void>
  variant?: "inline" | "stacked"
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
export function Newsletter({
  title = "Stay up to date",
  description = "Subscribe to our newsletter for the latest updates.",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  onSubmit,
  variant = "inline",
  className,
}: NewsletterProps) {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    try {
      await onSubmit?.(email)
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "mt-6",
            variant === "inline"
              ? "flex gap-2"
              : "flex flex-col gap-3",
          )}
        >
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={variant === "inline" ? "flex-1" : ""}
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className={variant === "stacked" ? "w-full" : ""}
          >
            {status === "loading" ? "Subscribing..." : buttonText}
          </Button>
        </form>

        {status === "success" && (
          <p className="mt-3 text-center text-sm text-green-600 dark:text-green-400">
            Thanks for subscribing!
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-center text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  )
}
