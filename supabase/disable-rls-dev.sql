-- Script temporal para desarrollo - DESHABILITA RLS
-- ⚠️ NO USAR EN PRODUCCIÓN ⚠️

-- Deshabilitar RLS temporalmente para debugging
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;

-- Verificar que los datos existan
SELECT 'Roles:' as tipo, COUNT(*) as total FROM public.roles
UNION ALL
SELECT 'Permissions:', COUNT(*) FROM public.permissions
UNION ALL
SELECT 'Profiles:', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'Role Permissions:', COUNT(*) FROM public.role_permissions;
