/**
 * Notification Store Template — Zustand store for notifications with polling.
 *
 * Stolen from: ChefKix notificationStore + Bookverse notification patterns.
 *
 * Manages notification state: unread count, list, mark-read, polling.
 * Connect to your notification API endpoints.
 *
 * Dependencies: zustand
 *
 * @example
 * import { useNotificationStore } from '@/store/notification-store'
 *
 * const { unreadCount, notifications, markAsRead } = useNotificationStore()
 *
 * // In a provider or layout, start polling:
 * useEffect(() => {
 *   const interval = setInterval(() => useNotificationStore.getState().fetchUnreadCount(), 30000)
 *   return () => clearInterval(interval)
 * }, [])
 */

import { create } from 'zustand'

// ─── Types (customize per project) ──────────────────

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  /** Optional action URL for click-through. */
  actionUrl?: string
  /** Optional metadata (e.g., sender avatar, order ID). */
  metadata?: Record<string, unknown>
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean

  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  setUnreadCount: (count: number) => void
  incrementUnreadCount: () => void

  // Async actions — implement with your API
  fetchUnreadCount: () => Promise<void>
  fetchNotifications: () => Promise<void>
}

/**
 * Factory to create notification store with your API service.
 *
 * @example
 * export const useNotificationStore = createNotificationStore({
 *   fetchCountFn: () => notificationApi.getUnreadCount(),
 *   fetchListFn: () => notificationApi.getAll(),
 *   markReadFn: (id) => notificationApi.markRead(id),
 *   markAllReadFn: () => notificationApi.markAllRead(),
 * })
 */
export function createNotificationStore(api: {
  fetchCountFn: () => Promise<number>
  fetchListFn: () => Promise<Notification[]>
  markReadFn?: (id: string) => Promise<void>
  markAllReadFn?: () => Promise<void>
}) {
  return create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    setNotifications: (notifications) =>
      set({ notifications, unreadCount: notifications.filter((n) => !n.read).length }),

    addNotification: (notification) =>
      set((s) => ({
        notifications: [notification, ...s.notifications],
        unreadCount: s.unreadCount + (notification.read ? 0 : 1),
      })),

    markAsRead: (id) => {
      set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }))
      api.markReadFn?.(id).catch(() => {
        // Revert optimistic update on failure
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: false } : n)),
          unreadCount: s.unreadCount + 1,
        }))
      })
    },

    markAllAsRead: () => {
      const prev = get().notifications
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }))
      api.markAllReadFn?.().catch(() => {
        set({ notifications: prev, unreadCount: prev.filter((n) => !n.read).length })
      })
    },

    setUnreadCount: (count) => set({ unreadCount: count }),
    incrementUnreadCount: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),

    fetchUnreadCount: async () => {
      try {
        const count = await api.fetchCountFn()
        set({ unreadCount: count })
      } catch {
        // Silent fail — polling will retry
      }
    },

    fetchNotifications: async () => {
      set({ isLoading: true })
      try {
        const notifications = await api.fetchListFn()
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
          isLoading: false,
        })
      } catch {
        set({ isLoading: false })
      }
    },
  }))
}
