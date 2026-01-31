'use client'

import { useAuth } from '@/providers/auth-provider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Perfil', href: '/profile' },
  ]

  // Agregar link de admin si el usuario es admin
  if (profile?.role?.name === 'admin') {
    navigation.push({ name: 'Administrar Usuarios', href: '/admin/users' })
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Train Builder
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === item.href
                    ? 'border-b-2 border-blue-500 text-gray-900'
                    : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role?.name || 'Usuario'}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
            </div>
            
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="space-y-1 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block py-2 pl-3 pr-4 text-base font-medium ${
                pathname === item.href
                  ? 'border-l-4 border-blue-500 bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
