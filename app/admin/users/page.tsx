'use client'

import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UsersTable } from '@/components/admin/users-table'
import { Navbar } from '@/components/layout/navbar'
import { getAllUsers, getAllRoles } from '@/lib/auth/actions'
import type { Profile, Role } from '@/types/auth'

export default function AdminUsersPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<(Profile & { role?: Role })[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || profile?.role?.name !== 'admin')) {
      router.push('/dashboard')
    }
  }, [user, profile, isLoading, router])

  useEffect(() => {
    if (user && profile?.role?.name === 'admin') {
      loadData()
    }
  }, [user, profile])

  const loadData = async () => {
    setLoading(true)
    const [usersData, rolesData] = await Promise.all([
      getAllUsers(),
      getAllRoles()
    ])
    setUsers(usersData)
    setRoles(rolesData)
    setLoading(false)
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!user || profile?.role?.name !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="mt-2 text-gray-600">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <UsersTable users={users} roles={roles} onUpdate={loadData} />
          </div>
        </div>
      </div>
    </div>
  )
}
