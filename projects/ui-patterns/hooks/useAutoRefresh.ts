/**
 * useAutoRefresh — Interval-based auto-refresh hook with enable/disable.
 *
 * Stolen from: 5TProMart useAutoRefresh.ts — used for dashboards, live data tables,
 * notification polling, etc.
 *
 * Dependencies: None (pure React hook)
 *
 * @example
 * const { isAutoRefreshing, toggleAutoRefresh } = useAutoRefresh({
 *   callback: () => refetch(),
 *   intervalMs: 30_000,
 *   enabled: true,
 * })
 *
 * <Button onClick={toggleAutoRefresh}>
 *   {isAutoRefreshing ? 'Pause' : 'Resume'} Auto-Refresh
 * </Button>
 */

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAutoRefreshOptions {
  /** Function to call on each interval tick. */
  callback: () => void | Promise<void>
  /** Interval in milliseconds (default: 30000). */
  intervalMs?: number
  /** Whether auto-refresh is initially enabled (default: true). */
  enabled?: boolean
}

export function useAutoRefresh({
  callback,
  intervalMs = 30_000,
  enabled = true,
}: UseAutoRefreshOptions) {
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(enabled)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const callbackRef = useRef(callback)

  // Keep callback ref fresh to avoid stale closures
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Manage interval
  useEffect(() => {
    if (isAutoRefreshing) {
      intervalRef.current = setInterval(() => {
        callbackRef.current()
      }, intervalMs)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoRefreshing, intervalMs])

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshing((prev) => !prev)
  }, [])

  const startAutoRefresh = useCallback(() => setIsAutoRefreshing(true), [])
  const stopAutoRefresh = useCallback(() => setIsAutoRefreshing(false), [])

  return {
    isAutoRefreshing,
    toggleAutoRefresh,
    startAutoRefresh,
    stopAutoRefresh,
  }
}
