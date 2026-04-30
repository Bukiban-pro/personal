import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Number Formatting ──────────────────────────────────

/**
 * Format large numbers with K/M suffix.
 * Stolen from: Bookverse HeroSection, Chefkix stats.
 *
 * @example
 * formatNumber(1234)     // "1.2K"
 * formatNumber(1500000)  // "1.5M"
 * formatNumber(42)       // "42"
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}

// ─── Scroll Utilities ───────────────────────────────────

/**
 * Smooth-scroll to an element by ID with configurable offset (for sticky headers).
 * Stolen from: Bookverse HeroSection scroll-to-section logic.
 *
 * @example
 * scrollToElement('features-section')           // default 80px offset
 * scrollToElement('intro', { offset: -100 })    // custom offset
 */
export function scrollToElement(
  elementId: string,
  options: { offset?: number; behavior?: ScrollBehavior } = {},
) {
  if (typeof window === 'undefined') return
  const { offset = -80, behavior = 'smooth' } = options
  const el = document.getElementById(elementId)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top: y, behavior })
}

// ─── String Utilities ───────────────────────────────────

/**
 * Extract initials from a name (e.g., for avatar fallbacks).
 * Stolen from: 5TProMart string.ts
 *
 * @example
 * getInitials('John Doe')          // "JD"
 * getInitials('Alice Bob Charlie') // "AC" (first + last)
 * getInitials('Madonna')           // "M"
 */
export function getInitials(name: string, maxInitials = 2): string {
  if (!name?.trim()) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return [parts[0], parts[parts.length - 1]]
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, maxInitials)
}

/**
 * Truncate a string with ellipsis.
 * Stolen from: 5TProMart string.ts
 *
 * @example
 * truncate('Hello World', 5) // "Hello..."
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + suffix
}

/**
 * Capitalize first letter of a string.
 * Stolen from: 5TProMart string.ts
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert string to Title Case.
 * Stolen from: 5TProMart string.ts
 *
 * @example
 * toTitleCase('hello world') // "Hello World"
 * toTitleCase('ENUM_VALUE')  // "Enum Value"
 */
export function toTitleCase(str: string): string {
  if (!str) return ''
  return str
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\B\w+/g, (word) => word.toLowerCase())
}

/**
 * Sanitize a string by encoding HTML entities (prevents XSS in rendered text).
 * Stolen from: 5TProMart string.ts
 */
export function sanitizeString(str: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return str.replace(/[&<>"']/g, (char) => map[char])
}

// ─── Currency Formatting ────────────────────────────────

/**
 * Format a number as currency with locale support.
 * Stolen from: Bookverse formatCurrency (generalized from VND-only).
 *
 * @example
 * formatCurrency(42.5)                     // "$42.50" (USD default)
 * formatCurrency(1500, 'VND', 'vi-VN')     // "1.500 ₫"
 * formatCurrency(99.99, 'EUR', 'de-DE')    // "99,99 €"
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
    ...options,
  }).format(amount)
}

// ─── Query/Pagination Utilities ─────────────────────────

/**
 * Build URLSearchParams from a filter object, skipping null/undefined/empty/"all" values.
 * Stolen from: 5TProMart queryParams.ts
 *
 * @example
 * buildQueryParams({ page: 1, search: 'foo', status: 'all', category: '' })
 * // URLSearchParams { page: "1", search: "foo" }
 */
export function buildQueryParams(
  filters: Record<string, string | number | boolean | null | undefined>,
): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === '' || value === 'all') continue
    params.set(key, String(value))
  }
  return params
}

/**
 * Convert frontend pagination params (1-indexed page + limit)
 * to backend pagination params (0-indexed page + size).
 * Stolen from: ChefKix apiUtils.ts
 *
 * @example
 * toBackendPagination({ page: 1, limit: 10 })
 * // { page: 0, size: 10 }
 */
export function toBackendPagination(params: { page: number; limit: number }): { page: number; size: number } {
  return { page: Math.max(0, params.page - 1), size: params.limit }
}
