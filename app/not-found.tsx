import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Not Found - Train Builder',
  description: 'Página no encontrada',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-bold text-slate-300 dark:text-slate-700">404</h1>
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-200">Página no encontrada</h2>
        <p className="text-slate-600 dark:text-slate-400">Lo sentimos, la página que buscas no existe.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
