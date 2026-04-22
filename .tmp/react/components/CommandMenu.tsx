"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────
interface CommandAction {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  onSelect: () => void
}

interface CommandGroup {
  heading: string
  actions: CommandAction[]
}

interface CommandMenuProps {
  /** Groups of actions */
  groups: CommandGroup[]
  /** Placeholder text */
  placeholder?: string
  /** Keyboard shortcut to open (default: Ctrl+K / ⌘K) */
  shortcut?: string
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────
/**
 * ⌘K command palette — the full experience.
 * Modal overlay, search input, grouped actions, keyboard navigation.
 * Wraps the concept into a single drop-in component.
 *
 * @example
 * <CommandMenu
 *   groups={[
 *     {
 *       heading: "Navigation",
 *       actions: [
 *         { id: "home", label: "Go to Home", onSelect: () => router.push("/") },
 *         { id: "dashboard", label: "Go to Dashboard", onSelect: () => router.push("/dashboard") },
 *       ],
 *     },
 *     {
 *       heading: "Actions",
 *       actions: [
 *         { id: "theme", label: "Toggle theme", shortcut: "⌘T", onSelect: toggleTheme },
 *       ],
 *     },
 *   ]}
 * />
 */
export function CommandMenu({
  groups,
  placeholder = "Type a command or search...",
  className,
}: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Flatten all actions for keyboard nav
  const filtered = React.useMemo(() => {
    const q = query.toLowerCase()
    return groups
      .map((g) => ({
        ...g,
        actions: g.actions.filter((a) => a.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.actions.length > 0)
  }, [groups, query])

  const allActions = filtered.flatMap((g) => g.actions)

  // ⌘K listener
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Focus input on open
  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, allActions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      allActions[selectedIndex]?.onSelect()
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
            className={cn(
              "fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl",
              className,
            )}
            role="dialog"
            aria-label="Command menu"
          >
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </p>
              )}
              {filtered.map((group) => (
                <div key={group.heading} className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {group.heading}
                  </div>
                  {group.actions.map((action) => {
                    const flatIdx = allActions.indexOf(action)
                    return (
                      <button
                        type="button"
                        key={action.id}
                        onClick={() => {
                          action.onSelect()
                          setOpen(false)
                        }}
                        onMouseEnter={() => setSelectedIndex(flatIdx)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          flatIdx === selectedIndex
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-accent/50",
                        )}
                      >
                        {action.icon && (
                          <span className="text-muted-foreground">
                            {action.icon}
                          </span>
                        )}
                        <span className="flex-1 text-left">{action.label}</span>
                        {action.shortcut && (
                          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {action.shortcut}
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
