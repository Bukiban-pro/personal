/**
 * NetworkStatusProvider — Online/offline detection with auto-toast.
 *
 * Stolen from: ChefKix OfflineBanner + network detection patterns from all 3 FEs.
 *
 * Monitors navigator.onLine, debounces state flickers, and provides context
 * for child components to conditionally render (e.g., disable forms when offline).
 *
 * Dependencies: React context only (no external libs)
 *
 * @example
 * // In root layout:
 * <NetworkStatusProvider>
 *   <App />
 * </NetworkStatusProvider>
 *
 * // In any component:
 * const { isOnline, wasOffline } = useNetworkStatus()
 * if (!isOnline) return <OfflineBanner />
 */

'use client'

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'

interface NetworkStatusContextValue {
  /** Current network state. */
  isOnline: boolean
  /** True if user went offline at least once this session (useful for "back online" toast). */
  wasOffline: boolean
}

const NetworkStatusContext = createContext<NetworkStatusContextValue>({
  isOnline: true,
  wasOffline: false,
})

interface NetworkStatusProviderProps {
  children: ReactNode
  /** Debounce ms to prevent flickers (default: 1000). */
  debounceMs?: number
  /** Called when status changes (e.g., to show toast). */
  onStatusChange?: (isOnline: boolean) => void
}

export function NetworkStatusProvider({
  children,
  debounceMs = 1000,
  onStatusChange,
}: NetworkStatusProviderProps) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [wasOffline, setWasOffline] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const updateStatus = (online: boolean) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setIsOnline(online)
        if (!online) setWasOffline(true)
        onStatusChange?.(online)
      }, debounceMs)
    }

    const handleOnline = () => updateStatus(true)
    const handleOffline = () => updateStatus(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [debounceMs, onStatusChange])

  return (
    <NetworkStatusContext.Provider value={{ isOnline, wasOffline }}>
      {children}
    </NetworkStatusContext.Provider>
  )
}

export function useNetworkStatus() {
  const ctx = useContext(NetworkStatusContext)
  if (!ctx) throw new Error('useNetworkStatus must be used within NetworkStatusProvider')
  return ctx
}
