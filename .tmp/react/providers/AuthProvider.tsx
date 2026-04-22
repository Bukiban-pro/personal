/**
 * AuthProvider — Session validation, route protection, and hydration gate.
 *
 * Stolen from: ChefKix AuthProvider + Bookverse auth patterns.
 *
 * Waits for client hydration, validates stored session, provides auth state
 * to children. Integrate with your auth store (Zustand) and token refresh system.
 *
 * Dependencies: React context, your auth store + token utilities
 *
 * @example
 * // In root layout:
 * <AuthProvider
 *   getSession={() => authStore.getState().session}
 *   validateSession={async (session) => { ... }}
 *   onInvalidSession={() => authStore.getState().logout()}
 * >
 *   {children}
 * </AuthProvider>
 *
 * // In any component:
 * const { isAuthenticated, isLoading, user } = useAuth()
 */

'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react'

// ─── Types ──────────────────────────────────────────

interface AuthUser {
  id: string
  email?: string
  name?: string
  roles?: string[]
  [key: string]: unknown
}

interface AuthContextValue {
  /** Whether initial session check is complete. */
  isLoading: boolean
  /** Whether user has a valid session. */
  isAuthenticated: boolean
  /** Current user (null if unauthenticated). */
  user: AuthUser | null
}

const AuthContext = createContext<AuthContextValue>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
})

// ─── Provider ───────────────────────────────────────

interface Session {
  user: AuthUser
  accessToken: string
}

interface AuthProviderProps {
  children: ReactNode
  /** Get current session from your store. Return null if no session. */
  getSession: () => Session | null
  /** Validate session on mount (e.g., check token expiry, call /me endpoint). */
  validateSession?: (session: Session) => Promise<boolean>
  /** Called when session is invalid or expired. Clean up store here. */
  onInvalidSession?: () => void
}

export function AuthProvider({
  children,
  getSession,
  validateSession,
  onInvalidSession,
}: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      try {
        const session = getSession()

        if (!session) {
          if (!cancelled) {
            setUser(null)
            setIsLoading(false)
          }
          return
        }

        // Optional validation (token check, /me call, etc.)
        if (validateSession) {
          const isValid = await validateSession(session)
          if (!isValid) {
            onInvalidSession?.()
            if (!cancelled) {
              setUser(null)
              setIsLoading(false)
            }
            return
          }
        }

        if (!cancelled) {
          setUser(session.user)
          setIsLoading(false)
        }
      } catch {
        onInvalidSession?.()
        if (!cancelled) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    checkSession()
    return () => { cancelled = true }
  }, [getSession, validateSession, onInvalidSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: !!user,
      user,
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
