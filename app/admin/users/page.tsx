import { getAllUsers, getAllRoles } from '@/lib/auth/actions'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { UsersTable } from '@/components/admin/users-table'

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser()

  // Verificar que el usuario es admin
  if (!currentUser || currentUser.profile.role?.name !== 'admin') {
    redirect('/dashboard')
  }

  const users = await getAllUsers()
  const roles = await getAllRoles()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-2 text-gray-600">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <UsersTable users={users} roles={roles} />
        </div>
      </div>
    </div>
  )
}
