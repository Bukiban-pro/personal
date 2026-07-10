export const routes = {
  home: '/',
  about: '/about',
  pricing: '/pricing',
  contact: '/contact',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  account: {
    profile: '/account/profile',
    settings: '/account/settings',
    security: '/account/security',
  },
  dashboard: {
    home: '/dashboard',
    analytics: '/dashboard/analytics',
  },
  items: {
    list: '/items',
    detail: (id: string) => `/items/${id}`,
    create: '/items/new',
    edit: (id: string) => `/items/${id}/edit`,
  },
}

export function isActiveRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}
