# Sistema de Autenticación - Train Builder

Este proyecto incluye un sistema completo de autenticación con roles y permisos usando Supabase.

## 🚀 Configuración Inicial

### 1. Configurar Base de Datos en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En el SQL Editor, ejecuta el contenido del archivo `supabase/schema.sql`
3. Esto creará todas las tablas necesarias:
   - `roles` - Roles del sistema
   - `permissions` - Permisos disponibles
   - `role_permissions` - Relación roles-permisos
   - `profiles` - Perfiles de usuario extendidos

### 2. Configurar Variables de Entorno

El archivo `.env.local` ya debería estar configurado con:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

## 📋 Estructura del Sistema de Auth

### Roles Predefinidos

1. **admin** - Acceso completo al sistema
2. **manager** - Permisos de gestión limitados
3. **user** - Usuario estándar con permisos básicos

### Permisos por Recurso

- **users**: create, read, update, delete
- **roles**: create, read, update, delete
- **settings**: read, update
- **dashboard**: read

### Archivos Principales

```
├── lib/
│   ├── auth/
│   │   └── actions.ts          # Server actions para auth
│   └── supabase/
│       ├── client.ts            # Cliente browser
│       ├── server.ts            # Cliente servidor
│       └── middleware.ts        # Helpers middleware
├── providers/
│   └── auth-provider.tsx        # Context provider de auth
├── hooks/
│   └── use-permissions.ts       # Hook para verificar permisos
├── components/
│   ├── auth/
│   │   ├── login-form.tsx       # Formulario de login
│   │   ├── signup-form.tsx      # Formulario de registro
│   │   └── protected-route.tsx  # Componente para proteger rutas
│   └── admin/
│       └── users-table.tsx      # Tabla de gestión de usuarios
├── types/
│   └── auth.ts                  # TypeScript types
└── supabase/
    └── schema.sql               # Schema de la base de datos
```

## 🔐 Uso del Sistema de Auth

### Verificar Permisos en Componentes Cliente

```tsx
'use client'
import { usePermissions } from '@/hooks/use-permissions'

export function MyComponent() {
  const { hasPermission, isAdmin } = usePermissions()

  if (!hasPermission('users.create')) {
    return <div>No tienes permisos</div>
  }

  return <div>Contenido protegido</div>
}
```

### Verificar Permisos en Server Components

```tsx
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || user.profile.role?.name !== 'admin') {
    redirect('/dashboard')
  }

  return <div>Panel de Admin</div>
}
```

### Proteger Rutas con Componente

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function MyPage() {
  return (
    <ProtectedRoute requiredPermission="users.read">
      <div>Contenido protegido</div>
    </ProtectedRoute>
  )
}
```

### Múltiples Permisos

```tsx
<ProtectedRoute 
  requiredPermissions={['users.create', 'users.update']}
  requireAll={false} // true = necesita todos, false = necesita al menos uno
>
  <div>Contenido</div>
</ProtectedRoute>
```

## 🎯 Funciones Disponibles

### Server Actions

- `signUp(formData)` - Registrar nuevo usuario
- `signIn(formData)` - Iniciar sesión
- `signOut()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual con perfil y permisos
- `updateProfile(formData)` - Actualizar perfil
- `updateUserRole(userId, roleId)` - Cambiar rol de usuario (admin)
- `updateUserStatus(userId, status)` - Cambiar estado de usuario (admin)
- `getAllUsers()` - Obtener todos los usuarios (admin)
- `getAllRoles()` - Obtener todos los roles

### Hooks de Permisos

```tsx
const {
  hasPermission,           // (permission: string) => boolean
  hasAnyPermission,        // (permissions: string[]) => boolean
  hasAllPermissions,       // (permissions: string[]) => boolean
  isAdmin,                 // () => boolean
  isManager,               // () => boolean
  canCreateUsers,          // () => boolean
  canReadUsers,            // () => boolean
  canUpdateUsers,          // () => boolean
  canDeleteUsers,          // () => boolean
  canManageRoles,          // () => boolean
  canManageSettings,       // () => boolean
  canAccessDashboard,      // () => boolean
} = usePermissions()
```

## 🔄 Flujo de Autenticación

1. Usuario se registra en `/signup`
2. Se crea automáticamente su perfil con rol "user"
3. El middleware actualiza las cookies de sesión
4. Usuario accede al `/dashboard`
5. Admin puede gestionar usuarios en `/admin/users`

## 🛡️ Seguridad

- **RLS (Row Level Security)** activado en todas las tablas
- Usuarios solo pueden ver/editar su propio perfil
- Admins tienen acceso completo
- Tokens JWT manejados automáticamente por Supabase
- Variables de entorno protegidas con `.env.local`

## 📱 Rutas Disponibles

- `/login` - Iniciar sesión
- `/signup` - Registrarse
- `/dashboard` - Dashboard principal (requiere auth)
- `/profile` - Ver/editar perfil (requiere auth)
- `/admin/users` - Gestión de usuarios (solo admin)

## 🚀 Próximos Pasos

1. Ejecuta el schema SQL en tu proyecto de Supabase
2. Configura las variables de entorno
3. Inicia el servidor: `npm run dev`
4. Registra el primer usuario
5. En Supabase, actualiza manualmente el rol del primer usuario a "admin"
6. Ya puedes gestionar usuarios desde `/admin/users`

## 💡 Tips

- El primer usuario que te registres debe ser promovido a admin manualmente en Supabase
- Puedes personalizar los roles y permisos editando el SQL
- Los permisos se verifican tanto en cliente como en servidor
- El middleware refresca automáticamente las sesiones
