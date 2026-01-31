-- Script de inicialización simplificado para verificar que todo esté correcto

-- Insertar roles por defecto si no existen
INSERT INTO public.roles (name, description) 
VALUES 
  ('admin', 'Administrador del sistema'),
  ('manager', 'Gerente con permisos extendidos'),
  ('user', 'Usuario estándar')
ON CONFLICT (name) DO NOTHING;

-- Insertar permisos básicos si no existen
INSERT INTO public.permissions (name, description, resource, action)
VALUES
  ('users.read', 'Ver usuarios', 'users', 'read'),
  ('users.create', 'Crear usuarios', 'users', 'create'),
  ('users.update', 'Actualizar usuarios', 'users', 'update'),
  ('users.delete', 'Eliminar usuarios', 'users', 'delete'),
  ('posts.read', 'Ver publicaciones', 'posts', 'read'),
  ('posts.create', 'Crear publicaciones', 'posts', 'create'),
  ('posts.update', 'Actualizar publicaciones', 'posts', 'update'),
  ('posts.delete', 'Eliminar publicaciones', 'posts', 'delete')
ON CONFLICT (name) DO NOTHING;

-- Asignar todos los permisos al rol admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Asignar permisos limitados al rol user
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'user'
AND p.action = 'read'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Verificar que todo esté correcto
DO $$
DECLARE
  role_count INTEGER;
  permission_count INTEGER;
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO role_count FROM public.roles;
  SELECT COUNT(*) INTO permission_count FROM public.permissions;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  
  RAISE NOTICE 'Roles: %, Permissions: %, Profiles: %', role_count, permission_count, profile_count;
END $$;
