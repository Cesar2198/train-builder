'use client'

import { useAuth } from '@/providers/auth-provider'

export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, isManager } = useAuth()

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    
    // Helpers específicos por recurso
    canCreateUsers: () => hasPermission('users.create'),
    canReadUsers: () => hasPermission('users.read'),
    canUpdateUsers: () => hasPermission('users.update'),
    canDeleteUsers: () => hasPermission('users.delete'),
    
    canManageRoles: () => hasAnyPermission(['roles.create', 'roles.update', 'roles.delete']),
    canManageSettings: () => hasPermission('settings.update'),
    
    canAccessDashboard: () => hasPermission('dashboard.read'),
  }
}
