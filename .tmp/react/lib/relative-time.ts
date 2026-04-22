// ── Relative Time Formatter ────────────────────────────────────────────
// "5 minutes ago" / "in 3 days" — from next-saas-starter pattern.
// Zero dependencies, uses the Intl.RelativeTimeFormat API.

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
]

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

/**
 * Format a date as a human-readable relative time string.
 *
 * @example
 * getRelativeTime(new Date(Date.now() - 30_000))   // "30 seconds ago"
 * getRelativeTime(new Date(Date.now() - 3_600_000)) // "1 hour ago"
 * getRelativeTime("2024-01-15T00:00:00Z")           // "6 months ago"
 */
export function getRelativeTime(date: Date | string | number): string {
  const target = date instanceof Date ? date : new Date(date)
  let diff = (target.getTime() - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(diff) < division.amount) {
      return rtf.format(Math.round(diff), division.name)
    }
    diff /= division.amount
  }

  // Fallback (shouldn't reach here)
  return target.toLocaleDateString()
}

/**
 * Short compact version: "5m", "2h", "3d", "1y"
 *
 * @example
 * getCompactTime(new Date(Date.now() - 300_000)) // "5m"
 */
export function getCompactTime(date: Date | string | number): string {
  const target = date instanceof Date ? date : new Date(date)
  const diffMs = Date.now() - target.getTime()
  const seconds = Math.floor(diffMs / 1000)

  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo`
  const years = Math.floor(days / 365)
  return `${years}y`
}
