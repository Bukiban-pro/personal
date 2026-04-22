/**
 * usePermissions — Generic role/permission checker hook.
 *
 * Stolen from: 5TProMart usePermissions + Bookverse role patterns.
 *
 * Provides permission-checking utilities based on user roles.
 * Customize the ROLE_HIERARCHY and PERMISSION_MAP per project.
 *
 * Dependencies: None (pure React hook, bring your own auth state)
 *
 * @example
 * const { hasRole, hasPermission, isAdmin } = usePermissions(user?.roles ?? [])
 *
 * {hasPermission('manage_users') && <AdminPanel />}
 * {hasRole('SELLER') && <SellerDashboard />}
 */

import { useMemo } from 'react'

// ─── Configuration (customize per project) ──────────

/**
 * Role hierarchy — higher index = more power.
 * Roles inherit all permissions of roles below them.
 */
const ROLE_HIERARCHY: string[] = [
  'USER',
  'SELLER',
  'PRO_SELLER',
  'MODERATOR',
  'ADMIN',
]

/**
 * Permission map — role → allowed actions.
 * Extend with your project's permissions.
 */
const PERMISSION_MAP: Record<string, string[]> = {
  USER: ['view_content', 'edit_profile', 'create_order'],
  SELLER: ['manage_listings', 'view_analytics'],
  PRO_SELLER: ['bulk_upload', 'advanced_analytics'],
  MODERATOR: ['moderate_content', 'manage_reports', 'manage_users'],
  ADMIN: ['manage_settings', 'manage_roles', 'view_audit_log', 'manage_system'],
}

// ─── Hook ───────────────────────────────────────────

export function usePermissions(userRoles: string[]) {
  return useMemo(() => {
    const roleSet = new Set(userRoles.map((r) => r.toUpperCase()))

    /** Get the highest role index for hierarchical comparison. */
    const highestRoleIndex = Math.max(
      ...Array.from(roleSet).map((r) => ROLE_HIERARCHY.indexOf(r)),
      -1,
    )

    /** Check if user has a specific role. */
    const hasRole = (role: string): boolean => roleSet.has(role.toUpperCase())

    /** Check if user has a specific permission (respects hierarchy). */
    const hasPermission = (permission: string): boolean => {
      // Gather all roles at or below user's highest level
      const effectiveRoles = ROLE_HIERARCHY.slice(0, highestRoleIndex + 1)
      const allPermissions = effectiveRoles.flatMap((r) => PERMISSION_MAP[r] ?? [])
      return allPermissions.includes(permission)
    }

    /** Check if user has ANY of the given roles. */
    const hasAnyRole = (...roles: string[]): boolean =>
      roles.some((r) => roleSet.has(r.toUpperCase()))

    const isAdmin = hasRole('ADMIN')
    const isModerator = hasRole('MODERATOR') || isAdmin

    return { hasRole, hasAnyRole, hasPermission, isAdmin, isModerator, highestRoleIndex }
  }, [userRoles])
}
