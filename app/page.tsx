export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Train Builder
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 text-center max-w-2xl">
            Bienvenido a Train Builder - Una aplicación moderna construida con Next.js 15, Tailwind CSS y shadcn/ui
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Comenzar
            </button>
            <button className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Documentación
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Next.js 15</h3>
              <p className="text-slate-600 dark:text-slate-400">
                La última versión de Next.js con App Router y React Server Components
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Framework CSS utility-first para un desarrollo rápido y flexible
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">shadcn/ui</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Componentes UI hermosos y accesibles listos para usar
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
