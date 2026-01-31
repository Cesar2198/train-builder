'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthContextType, UserWithProfile, Permission } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loadUser = async () => {
    // Evitar cargas múltiples simultáneas
    if (isLoadingUser) {
      console.log('Already loading user, skipping...')
      return
    }
    
    console.log('🔵 Starting loadUser...')
    
    try {
      setIsLoadingUser(true)
      setIsLoading(true)
      
      console.log('🔵 Step 1: Getting auth user...')
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      console.log('1. Auth user:', authUser?.id, authUser?.email, 'Error:', authError)

      if (authError || !authUser) {
        console.log('❌ No auth user found')
        setUser(null)
        setIsLoading(false)
        setIsLoadingUser(false)
        return
      }

      console.log('🔵 Step 2: Getting profile...')
      // Obtener perfil simple
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      console.log('2. Profile:', profile, 'Error:', profileError)

      // Si no hay perfil, crear usuario básico sin perfil
      if (profileError || !profile) {
        console.warn('⚠️ No profile found, using basic user')
        const basicUser = {
          id: authUser.id,
          email: authUser.email!,
          profile: {
            id: authUser.id,
            role_id: null,
            full_name: authUser.email || null,
            avatar_url: null,
            phone: null,
            status: 'active' as const,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          permissions: [],
        }
        console.log('✅ Setting basic user:', basicUser)
        setUser(basicUser)
        setIsLoading(false)
        setIsLoadingUser(false)
        return
      }

      console.log('🔵 Step 3: Getting role...')
      // Obtener rol si existe role_id
      let role = null
      if (profile.role_id) {
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('*')
          .eq('id', profile.role_id)
          .single()
        console.log('3. Role:', roleData, 'Error:', roleError)
        role = roleData
      } else {
        console.log('3. No role_id in profile')
      }

      console.log('🔵 Step 4: Getting permissions...')
      // Obtener permisos usando query directa en lugar de RPC
      let permissions: any[] = []
      if (profile.role_id) {
        const { data: permData, error: permError } = await supabase
          .from('role_permissions')
          .select(`
            permission:permissions(*)
          `)
          .eq('role_id', profile.role_id)
        
        console.log('4. Permissions query:', permData, 'Error:', permError)
        
        if (permData && !permError) {
          permissions = permData
            .map((rp: any) => rp.permission)
            .filter((p: any) => p !== null)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              resource: p.resource,
              action: p.action,
              description: p.description,
              created_at: p.created_at
            }))
        }
      } else {
        console.log('4. No role_id, skipping permissions')
      }

      const userData = {
        id: authUser.id,
        email: authUser.email!,
        profile: {
          ...profile,
          role: role
        },
        permissions,
      }
      
      console.log('✅ Step 5: Final user data:', userData)
      console.log('✅ Setting user and isLoading=false')
      setUser(userData)
      setIsLoading(false)
      setIsLoadingUser(false)
    } catch (error) {
      console.error('❌ Error loading user:', error)
      setUser(null)
      setIsLoading(false)
      setIsLoadingUser(false)
    }
    
    console.log('🔵 loadUser completed')
  }

  useEffect(() => {
    console.log('🟢 AuthProvider mounted, calling loadUser')
    loadUser()
    
    // Timeout de seguridad: si después de 10 segundos sigue loading, forzar false
    const safetyTimeout = setTimeout(() => {
      console.warn('⚠️ SAFETY TIMEOUT: Forcing isLoading to false after 10 seconds')
      setIsLoading(false)
      setIsLoadingUser(false)
    }, 10000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        if (event === 'SIGNED_IN') {
          console.log('User signed in, reloading user data')
          await loadUser()
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
          setUser(null)
          setIsLoading(false)
          setIsLoadingUser(false)
        }
        // Ignorar TOKEN_REFRESHED para evitar recargas constantes
      }
    )

    return () => {
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.some((p: Permission) => p.name === permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.every(permission => hasPermission(permission))
  }

  const isAdmin = (): boolean => {
    return user?.profile?.role?.name === 'admin'
  }

  const isManager = (): boolean => {
    return user?.profile?.role?.name === 'manager' || isAdmin()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  const refreshUser = async () => {
    await loadUser()
  }

  const value: AuthContextType = {
    user,
    profile: user?.profile || null,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
