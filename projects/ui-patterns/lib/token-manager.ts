/**
 * Token Manager — JWT decode, expiry detection, and centralized refresh queue.
 *
 * Stolen from: ChefKix tokenManager.ts (full queue-based refresh, decode, expiry,
 * proactive scheduling, subscriber pattern).
 *
 * Dependencies: None (pure JS, no libraries)
 *
 * Usage: Import individual functions, or use TokenManager as a singleton coordinator.
 *
 * @example
 * // Decode and check
 * const claims = decodeToken(accessToken)
 * if (isTokenExpired(accessToken)) { ... }
 *
 * // Centralized refresh — deduplicates concurrent calls
 * const manager = createTokenManager({ refreshFn: () => authService.refresh() })
 * const newToken = await manager.refreshAccessToken()
 */

// ─── JWT Decode ─────────────────────────────────────

interface JwtPayload {
  sub?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}

/**
 * Decode a JWT without verification (client-side only — never trust for auth decisions on server).
 * Returns null if the token is invalid or malformed.
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

// ─── Expiry Checks ──────────────────────────────────

/**
 * Get seconds until token expires. Returns 0 if expired or invalid.
 */
export function getSecondsUntilExpiry(token: string): number {
  const payload = decodeToken(token)
  if (!payload?.exp) return 0
  return Math.max(0, payload.exp - Math.floor(Date.now() / 1000))
}

/**
 * Check if a token is expired (with optional buffer in seconds).
 * @param bufferSeconds - Consider expired this many seconds early (default: 30)
 */
export function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  return getSecondsUntilExpiry(token) <= bufferSeconds
}

/**
 * Check if a token should be proactively refreshed (e.g., 80% through its lifetime).
 * @param thresholdPercent - Refresh when this % of lifetime has elapsed (default: 0.75)
 */
export function shouldRefreshToken(token: string, thresholdPercent = 0.75): boolean {
  const payload = decodeToken(token)
  if (!payload?.exp || !payload?.iat) return true

  const totalLifetime = payload.exp - payload.iat
  const elapsed = Math.floor(Date.now() / 1000) - payload.iat
  return elapsed / totalLifetime >= thresholdPercent
}

// ─── Centralized Refresh Manager ────────────────────

type RefreshFn = () => Promise<string>
type Subscriber = (token: string | null) => void

export type RefreshErrorType = 'EXPIRED' | 'NETWORK' | 'UNKNOWN'

interface TokenManagerOptions {
  /** Function that performs the actual token refresh (e.g., calls /auth/refresh) */
  refreshFn: RefreshFn
  /** Called when refresh permanently fails (e.g., redirect to login) */
  onRefreshFailure?: (errorType: RefreshErrorType) => void
  /** Minimum ms between refresh attempts (default: 5000) */
  minRefreshInterval?: number
}

interface TokenManager {
  /** Refresh the access token. Deduplicates concurrent calls. */
  refreshAccessToken: () => Promise<string | null>
  /** Subscribe to token changes. Returns unsubscribe function. */
  onTokenChange: (callback: Subscriber) => () => void
  /** Reset internal state (call on logout). */
  reset: () => void
}

/**
 * Create a centralized token refresh manager.
 *
 * Solves the "thundering herd" problem: when multiple API calls get 401 simultaneously,
 * only ONE refresh request is made. All callers await the same promise.
 *
 * @example
 * const tokenManager = createTokenManager({
 *   refreshFn: async () => {
 *     const { accessToken } = await authApi.refresh()
 *     return accessToken
 *   },
 *   onRefreshFailure: (type) => {
 *     if (type === 'EXPIRED') router.push('/login')
 *   },
 * })
 *
 * // In axios interceptor:
 * api.interceptors.response.use(null, async (error) => {
 *   if (error.response?.status === 401 && !error.config._retry) {
 *     error.config._retry = true
 *     const newToken = await tokenManager.refreshAccessToken()
 *     if (newToken) {
 *       error.config.headers.Authorization = `Bearer ${newToken}`
 *       return api(error.config)
 *     }
 *   }
 *   return Promise.reject(error)
 * })
 */
export function createTokenManager(options: TokenManagerOptions): TokenManager {
  const { refreshFn, onRefreshFailure, minRefreshInterval = 5000 } = options

  let isRefreshing = false
  let refreshPromise: Promise<string | null> | null = null
  let lastRefreshTime = 0
  const subscribers: Set<Subscriber> = new Set()

  function notifySubscribers(token: string | null) {
    subscribers.forEach((cb) => cb(token))
  }

  function categorizeError(error: unknown): RefreshErrorType {
    const axiosLike = error as { response?: { status?: number }; code?: string; message?: string }

    if (!axiosLike.response) return 'NETWORK'
    if (axiosLike.response.status === 401 || axiosLike.response.status === 403) return 'EXPIRED'
    return 'UNKNOWN'
  }

  async function refreshAccessToken(): Promise<string | null> {
    // Rate limit: don't refresh more than once per interval
    const now = Date.now()
    if (now - lastRefreshTime < minRefreshInterval && refreshPromise) {
      return refreshPromise
    }

    // Deduplicate: if already refreshing, queue behind existing request
    if (isRefreshing && refreshPromise) {
      return refreshPromise
    }

    isRefreshing = true
    lastRefreshTime = now

    refreshPromise = (async () => {
      try {
        const newToken = await refreshFn()
        notifySubscribers(newToken)
        return newToken
      } catch (error) {
        const errorType = categorizeError(error)
        onRefreshFailure?.(errorType)
        notifySubscribers(null)
        return null
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  function onTokenChange(callback: Subscriber): () => void {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
  }

  function reset() {
    isRefreshing = false
    refreshPromise = null
    lastRefreshTime = 0
    subscribers.clear()
  }

  return { refreshAccessToken, onTokenChange, reset }
}
