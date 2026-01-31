-- Habilitar extensiones necesarias
create extension if not exists "uuid-ossp";

-- Tabla de roles
create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de permisos
create table if not exists public.permissions (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  resource text not null, -- ejemplo: 'users', 'posts', 'settings'
  action text not null, -- ejemplo: 'create', 'read', 'update', 'delete'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de relación roles-permisos
create table if not exists public.role_permissions (
  id uuid primary key default uuid_generate_v4(),
  role_id uuid references public.roles(id) on delete cascade not null,
  permission_id uuid references public.permissions(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(role_id, permission_id)
);

-- Tabla de perfiles de usuario (extiende auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete set null,
  full_name text,
  avatar_url text,
  phone text,
  status text default 'active' check (status in ('active', 'inactive', 'suspended')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para mejor performance
create index if not exists profiles_role_id_idx on public.profiles(role_id);
create index if not exists profiles_status_idx on public.profiles(status);
create index if not exists role_permissions_role_id_idx on public.role_permissions(role_id);
create index if not exists role_permissions_permission_id_idx on public.role_permissions(permission_id);

-- Función para actualizar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_role_updated
  before update on public.roles
  for each row execute procedure public.handle_updated_at();

-- Función para crear perfil automáticamente cuando se registra un usuario
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_role_id uuid;
begin
  -- Obtener el rol por defecto (usuario)
  select id into default_role_id from public.roles where name = 'user' limit 1;
  
  -- Crear perfil
  insert into public.profiles (id, role_id, full_name, avatar_url)
  values (
    new.id,
    default_role_id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para crear perfil cuando se registra un usuario
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Función para verificar permisos de usuario
create or replace function public.user_has_permission(
  user_id uuid,
  permission_name text
)
returns boolean as $$
declare
  has_perm boolean;
begin
  select exists(
    select 1
    from public.profiles p
    join public.role_permissions rp on rp.role_id = p.role_id
    join public.permissions perm on perm.id = rp.permission_id
    where p.id = user_id
    and perm.name = permission_name
  ) into has_perm;
  
  return has_perm;
end;
$$ language plpgsql security definer;

-- Función para obtener todos los permisos de un usuario
create or replace function public.get_user_permissions(user_id uuid)
returns table(
  permission_name text,
  resource text,
  action text
) as $$
begin
  return query
  select 
    perm.name,
    perm.resource,
    perm.action
  from public.profiles p
  join public.role_permissions rp on rp.role_id = p.role_id
  join public.permissions perm on perm.id = rp.permission_id
  where p.id = user_id;
end;
$$ language plpgsql security definer;

-- RLS (Row Level Security) Policies

-- Habilitar RLS en todas las tablas
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

-- Políticas para profiles
create policy "Los usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Los admins pueden ver todos los perfiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      join public.roles r on r.id = p.role_id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "Los admins pueden actualizar todos los perfiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      join public.roles r on r.id = p.role_id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

-- Políticas para roles (solo lectura para todos autenticados)
create policy "Usuarios autenticados pueden ver roles"
  on public.roles for select
  using (auth.uid() is not null);

-- Políticas para permissions (solo lectura para todos autenticados)
create policy "Usuarios autenticados pueden ver permisos"
  on public.permissions for select
  using (auth.uid() is not null);

-- Políticas para role_permissions (solo lectura para todos autenticados)
create policy "Usuarios autenticados pueden ver role_permissions"
  on public.role_permissions for select
  using (auth.uid() is not null);

-- Insertar roles por defecto
insert into public.roles (name, description) values
  ('admin', 'Administrador con acceso completo al sistema'),
  ('manager', 'Gerente con permisos de gestión limitados'),
  ('user', 'Usuario estándar con permisos básicos')
on conflict (name) do nothing;

-- Insertar permisos por defecto
insert into public.permissions (name, resource, action, description) values
  -- Permisos de usuarios
  ('users.create', 'users', 'create', 'Crear nuevos usuarios'),
  ('users.read', 'users', 'read', 'Ver usuarios'),
  ('users.update', 'users', 'update', 'Actualizar usuarios'),
  ('users.delete', 'users', 'delete', 'Eliminar usuarios'),
  
  -- Permisos de roles
  ('roles.create', 'roles', 'create', 'Crear roles'),
  ('roles.read', 'roles', 'read', 'Ver roles'),
  ('roles.update', 'roles', 'update', 'Actualizar roles'),
  ('roles.delete', 'roles', 'delete', 'Eliminar roles'),
  
  -- Permisos de configuración
  ('settings.read', 'settings', 'read', 'Ver configuración'),
  ('settings.update', 'settings', 'update', 'Actualizar configuración'),
  
  -- Permisos de dashboard
  ('dashboard.read', 'dashboard', 'read', 'Ver dashboard')
on conflict (name) do nothing;

-- Asignar todos los permisos al rol admin
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin'
on conflict (role_id, permission_id) do nothing;

-- Asignar permisos limitados al rol manager
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'manager'
and p.name in ('users.read', 'users.update', 'roles.read', 'dashboard.read', 'settings.read')
on conflict (role_id, permission_id) do nothing;

-- Asignar permisos básicos al rol user
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'user'
and p.name in ('dashboard.read')
on conflict (role_id, permission_id) do nothing;
