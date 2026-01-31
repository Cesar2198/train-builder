export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface Role {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  description: string | null
  resource: string
  action: string
  created_at: string
}

export interface Profile {
  id: string
  role_id: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  status: UserStatus
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  role?: Role
}

export interface UserWithProfile {
  id: string
  email: string
  profile: Profile
  permissions: Permission[]
}

export interface AuthContextType {
  user: UserWithProfile | null
  profile: Profile | null
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  isAdmin: () => boolean
  isManager: () => boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}
