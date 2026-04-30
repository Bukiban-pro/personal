/**
 * TokenRefreshProvider — Proactive JWT refresh scheduling.
 *
 * Stolen from: ChefKix TokenRefreshManager + 5TProMart token refresh patterns.
 *
 * Schedules refresh based on JWT exp claim. Also refreshes on tab visibility change
 * (handles user returning after laptop sleep / long tab switch).
 *
 * Dependencies: @/lib/token-manager (shouldRefreshToken, getSecondsUntilExpiry, createTokenManager)
 *
 * @example
 * // In root layout:
 * <TokenRefreshProvider
 *   getAccessToken={() => authStore.getState().accessToken}
 *   refreshFn={() => authService.refresh()}
 *   onNewToken={(token) => authStore.getState().setAccessToken(token)}
 *   onRefreshFailure={() => { authStore.getState().logout(); router.push('/login') }}
 * >
 *   {children}
 * </TokenRefreshProvider>
 */

'use client'

import { useEffect, useRef, useCallback, type ReactNode } from 'react'
import {
  shouldRefreshToken,
  getSecondsUntilExpiry,
  createTokenManager,
  type RefreshErrorType,
} from '@/lib/token-manager'

interface TokenRefreshProviderProps {
  children: ReactNode
  /** Get current access token from your auth store. */
  getAccessToken: () => string | null
  /** Function that performs the actual refresh (returns new access token). */
  refreshFn: () => Promise<string>
  /** Called with the new token after successful refresh. */
  onNewToken: (token: string) => void
  /** Called when refresh permanently fails. */
  onRefreshFailure?: (errorType: RefreshErrorType) => void
  /** Refresh when this % of token lifetime has elapsed (default: 0.75). */
  refreshThreshold?: number
}

export function TokenRefreshProvider({
  children,
  getAccessToken,
  refreshFn,
  onNewToken,
  onRefreshFailure,
  refreshThreshold = 0.75,
}: TokenRefreshProviderProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const managerRef = useRef(
    createTokenManager({
      refreshFn,
      onRefreshFailure,
    }),
  )

  const scheduleRefresh = useCallback(() => {
    // Clear existing timer
    if (timerRef.current) clearTimeout(timerRef.current)

    const token = getAccessToken()
    if (!token) return

    const secondsLeft = getSecondsUntilExpiry(token)
    if (secondsLeft <= 0) return

    // Schedule refresh at threshold (e.g., 75% through lifetime → 25% remaining)
    const refreshIn = Math.max(1, secondsLeft * (1 - refreshThreshold)) * 1000

    timerRef.current = setTimeout(async () => {
      const newToken = await managerRef.current.refreshAccessToken()
      if (newToken) {
        onNewToken(newToken)
        scheduleRefresh() // Re-schedule for next cycle
      }
    }, refreshIn)
  }, [getAccessToken, onNewToken, refreshThreshold])

  // Initial schedule
  useEffect(() => {
    scheduleRefresh()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [scheduleRefresh])

  // Refresh on tab return (handles laptop sleep, long background)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const token = getAccessToken()
        if (token && shouldRefreshToken(token, refreshThreshold)) {
          managerRef.current.refreshAccessToken().then((newToken) => {
            if (newToken) {
              onNewToken(newToken)
              scheduleRefresh()
            }
          })
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [getAccessToken, onNewToken, refreshThreshold, scheduleRefresh])

  return <>{children}</>
}
