// ── TanStack Query Key Factory Template ────────────────────────────────
// Structured key factories for cache management, invalidation, and prefetching.
// Replace <domain> placeholders with your actual API domains.
//
// Usage:
//   queryKey: queryKeys.users.detail(id)
//   queryClient.invalidateQueries({ queryKey: queryKeys.users.all })

export const queryKeys = {
  // ── Users ──
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: (id: string) => [...queryKeys.users.all, "profile", id] as const,
  },

  // ── Products ──
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.products.all, "search", query] as const,
  },

  // ── Orders ──
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  // ── Notifications ──
  notifications: {
    all: ["notifications"] as const,
    unreadCount: () => [...queryKeys.notifications.all, "unread-count"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.notifications.all, "list", filters] as const,
  },

  // ── Stats / Dashboard ──
  stats: {
    all: ["stats"] as const,
    overview: () => [...queryKeys.stats.all, "overview"] as const,
    chart: (range: string) =>
      [...queryKeys.stats.all, "chart", range] as const,
  },
} as const

// ── Helper: create a domain factory ────────────────────────────────────
// Use this to add new domains without copy-pasting the pattern.
export function createQueryKeys<T extends string>(domain: T) {
  const all = [domain] as const
  return {
    all,
    lists: () => [...all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...all, "list", filters] as const,
    details: () => [...all, "detail"] as const,
    detail: (id: string) => [...all, "detail", id] as const,
  }
}
