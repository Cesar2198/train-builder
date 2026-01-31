import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, {user.profile.full_name || user.email}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card de información del usuario */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tu Información
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rol</dt>
                <dd className="text-sm text-gray-900">
                  {user.profile.role?.name || 'Sin rol'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Estado</dt>
                <dd className="text-sm text-gray-900 capitalize">
                  {user.profile.status}
                </dd>
              </div>
            </dl>
          </div>

          {/* Card de permisos */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tus Permisos
            </h3>
            <div className="space-y-2">
              {user.permissions.length > 0 ? (
                user.permissions.map((permission: any) => (
                  <div
                    key={permission.permission_name}
                    className="flex items-center text-sm"
                  >
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span className="text-gray-700">{permission.permission_name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Sin permisos asignados</p>
              )}
            </div>
          </div>

          {/* Card de acciones rápidas */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              <a
                href="/profile"
                className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Ver Perfil
              </a>
              {user.profile.role?.name === 'admin' && (
                <a
                  href="/admin/users"
                  className="block w-full rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-500"
                >
                  Gestionar Usuarios
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
