import { useState, useCallback } from "react"

/**
 * Copy text to clipboard with success/error state tracking.
 *
 * @example
 * const { copy, copied, error } = useClipboard({ timeout: 2000 })
 * <button onClick={() => copy("Hello!")}>
 *   {copied ? "Copied!" : "Copy"}
 * </button>
 */
export function useClipboard({ timeout = 2000 } = {}) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setError(null)

        setTimeout(() => setCopied(false), timeout)
      } catch (err) {
        setCopied(false)
        setError(err instanceof Error ? err : new Error("Copy failed"))
      }
    },
    [timeout],
  )

  return { copy, copied, error }
}
