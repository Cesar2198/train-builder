'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null
  }

  // Obtener perfil con rol
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      *,
      role:roles(*)
    `)
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  // Obtener permisos del usuario
  const { data: permissions } = await supabase
    .rpc('get_user_permissions', { user_id: user.id })

  return {
    id: user.id,
    email: user.email!,
    profile,
    permissions: permissions || [],
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  const updates = {
    id: user.id,
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function updateUserRole(userId: string, roleId: string) {
  const supabase = await createClient()
  
  // Verificar que el usuario actual es admin
  const currentUser = await getCurrentUser()
  if (!currentUser?.profile?.role?.name || currentUser.profile.role.name !== 'admin') {
    return { error: 'No tienes permisos para realizar esta acción' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role_id: roleId, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended') {
  const supabase = await createClient()
  
  // Verificar que el usuario actual es admin
  const currentUser = await getCurrentUser()
  if (!currentUser?.profile?.role?.name || currentUser.profile.role.name !== 'admin') {
    return { error: 'No tienes permisos para realizar esta acción' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function getAllUsers() {
  const supabase = await createClient()
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      *,
      role:roles(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return users || []
}

export async function getAllRoles() {
  const supabase = await createClient()
  
  const { data: roles, error } = await supabase
    .from('roles')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching roles:', error)
    return []
  }

  return roles || []
}
