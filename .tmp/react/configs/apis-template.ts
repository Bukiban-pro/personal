/**
 * API Configuration Template — Endpoints, axios instance, interceptors.
 *
 * Stolen from: All 3 frontends — axios interceptor patterns (request token injection,
 * response 401 → refresh → retry), endpoint registry, buildUrl utility.
 *
 * Dependencies: axios, @/lib/token-manager (createTokenManager), @/lib/error-utils (parseError)
 *
 * @example
 * import { api, apiEndpoints } from '@/configs/apis'
 * const user = await api.get(apiEndpoints.users.me)
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

// ─── Endpoint Registry ──────────────────────────────

export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  users: {
    me: '/api/users/me',
    profile: '/api/users/profile',
    updateProfile: '/api/users/profile',
    detail: (id: string) => `/api/users/${id}`,
  },
  items: {
    list: '/api/items',
    detail: (id: string) => `/api/items/${id}`,
    create: '/api/items',
    update: (id: string) => `/api/items/${id}`,
    delete: (id: string) => `/api/items/${id}`,
    search: '/api/items/search',
  },
}

// ─── Axios Instance ─────────────────────────────────

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send cookies (refresh token)
})

// ─── Request Interceptor (attach token) ─────────────

/**
 * Wire up token injection. Call this once at app init.
 *
 * @param getAccessToken - function returning current token (from Zustand, etc.)
 *
 * @example
 * setupRequestInterceptor(() => useAuthStore.getState().accessToken)
 */
export function setupRequestInterceptor(getAccessToken: () => string | null) {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )
}

// ─── Response Interceptor (401 → refresh → retry) ──

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/**
 * Wire up 401 auto-refresh. Call this once at app init.
 *
 * @param refreshFn - function that refreshes and returns new access token
 * @param onRefreshFailure - called when refresh fails (e.g., redirect to login)
 * @param setAccessToken - store the new token
 *
 * @example
 * setupResponseInterceptor(
 *   () => authService.refresh(),
 *   () => { authStore.getState().logout(); router.push('/login') },
 *   (token) => authStore.getState().setAccessToken(token),
 * )
 */
export function setupResponseInterceptor(
  refreshFn: () => Promise<string>,
  onRefreshFailure: () => void,
  setAccessToken: (token: string) => void,
) {
  let isRefreshing = false
  let refreshSubscribers: ((token: string) => void)[] = []

  function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb)
  }

  function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token))
    refreshSubscribers = []
  }

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequest | undefined
      if (!originalRequest) return Promise.reject(error)

      // Only retry 401s, and only once per request
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        // Queue behind the in-flight refresh
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const newToken = await refreshFn()
        setAccessToken(newToken)
        onTokenRefreshed(newToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return api(originalRequest)
      } catch {
        refreshSubscribers = []
        onRefreshFailure()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    },
  )
}

// ─── URL Builder ────────────────────────────────────

export function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>) {
  if (!params) return endpoint

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${endpoint}?${queryString}` : endpoint
}
