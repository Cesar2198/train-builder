'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getDebugInfo() {
      // 1. Verificar sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      // 2. Verificar usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      // 3. Si hay usuario, intentar obtener el perfil
      let profile = null
      let profileError = null
      if (user) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        profile = result.data
        profileError = result.error
      }

      setDebugInfo({
        session: session ? 'Existe' : 'No existe',
        sessionError,
        user: user ? { id: user.id, email: user.email } : null,
        userError,
        profile,
        profileError,
        timestamp: new Date().toISOString()
      })
    }

    getDebugInfo()
  }, [])

  if (!debugInfo) return <div>Cargando debug info...</div>

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-md text-xs font-mono">
      <h3 className="font-bold mb-2">Debug Auth Info</h3>
      <pre className="overflow-auto max-h-96">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}
