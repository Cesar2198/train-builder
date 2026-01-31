'use client'

import { useState } from 'react'
import { updateUserRole, updateUserStatus } from '@/lib/auth/actions'
import type { Profile, Role } from '@/types/auth'

interface UsersTableProps {
  users: (Profile & { role?: Role })[]
  roles: Role[]
}

export function UsersTable({ users, roles }: UsersTableProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, roleId: string) => {
    setIsUpdating(userId)
    await updateUserRole(userId, roleId)
    setIsUpdating(null)
  }

  const handleStatusChange = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    setIsUpdating(userId)
    await updateUserStatus(userId, status)
    setIsUpdating(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Registro
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className={isUpdating === user.id ? 'opacity-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-700 font-medium text-sm">
                        {user.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || 'Sin nombre'}
                    </div>
                    <div className="text-sm text-gray-500">{user.phone || 'Sin teléfono'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.role_id || ''}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={isUpdating === user.id}
                  className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Sin rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value as any)}
                  disabled={isUpdating === user.id}
                  className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString('es-ES')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
