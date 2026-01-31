'use client'

import { LoginForm } from '@/components/auth/login-form'
import { useAuth } from '@/providers/auth-provider-simple'

export default function LoginPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Si ya hay usuario, redirigir al dashboard
  if (user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
