'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SimpleUser {
  id: string
  email: string
}

interface SimpleAuthContextType {
  user: SimpleUser | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<SimpleAuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    console.log('🟢 Simple AuthProvider mounted')
    
    const checkUser = async () => {
      try {
        console.log('Checking user...')
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        console.log('Auth result:', { user: authUser, error })
        
        if (error) {
          console.error('Error getting user:', error)
          setUser(null)
        } else if (authUser) {
          console.log('✅ User found:', authUser.email)
          setUser({
            id: authUser.id,
            email: authUser.email!
          })
        } else {
          console.log('No user')
          setUser(null)
        }
      } catch (err) {
        console.error('Exception:', err)
        setUser(null)
      } finally {
        console.log('Setting isLoading to false')
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!
          })
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value: SimpleAuthContextType = {
    user,
    isLoading,
    signOut,
  }

  console.log('Rendering AuthProvider, user:', user, 'loading:', isLoading)

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
