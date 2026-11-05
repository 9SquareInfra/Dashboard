-- =============================================================================
-- 9 Square Infra Dashboard — paste this ONCE into Supabase → SQL Editor → Run
-- Project: https://lfldgnjzxhsgrwxdpqwj.supabase.co
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.
-- =============================================================================

create extension if not exists "pgcrypto";

-- Roles
do $$ begin
  create type public.app_role as enum ('admin', 'manager', 'user');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.doc_kind as enum ('estimate', 'quotation', 'agreement');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.doc_status as enum (
    'draft', 'pending_approval', 'changes_requested', 'approved',
    'sent', 'accepted', 'rejected'
  );
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null default '',
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- settings (singleton row id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  type public.doc_kind not null default 'estimate',
  project_type text not null default 'Construction',
  client_name text not null default '',
  client_phone text not null default '',
  data jsonb not null default '{}'::jsonb,
  total numeric(14,2) not null default 0,
  status public.doc_status not null default 'draft',
  manager_comment text not null default '',
  created_by uuid not null references auth.users (id),
  approved_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_created_by_idx on public.documents (created_by);
create index if not exists documents_status_idx on public.documents (status);
create index if not exists documents_updated_at_idx on public.documents (updated_at desc);

-- ---------------------------------------------------------------------------
-- activity_log
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id bigserial primary key,
  document_id uuid references public.documents (id) on delete set null,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_doc_idx on public.activity_log (document_id);

-- ---------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER — role lives in profiles, never user_metadata)
-- ---------------------------------------------------------------------------
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'user'::public.app_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'admin'::public.app_role;
$$;

create or replace function public.is_manager_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in ('admin'::public.app_role, 'manager'::public.app_role);
$$;

revoke all on function public.current_app_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_manager_or_admin() from public;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_manager_or_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup; promote first admin by email
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.app_role := 'user';
  dn text;
begin
  dn := coalesce(
    nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
    split_part(new.email, '@', 1)
  );
  if lower(new.email) = lower('9squareinfravijayawada@gmail.com') then
    r := 'admin';
  end if;
  insert into public.profiles (id, email, display_name, role)
  values (new.id, new.email, dn, r)
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(nullif(profiles.display_name, ''), excluded.display_name),
        role = case
          when lower(excluded.email) = lower('9squareinfravijayawada@gmail.com') then 'admin'::public.app_role
          else profiles.role
        end,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Also promote if that email already exists when SQL is pasted later
update public.profiles p
set role = 'admin', updated_at = now()
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('9squareinfravijayawada@gmail.com');

-- ---------------------------------------------------------------------------
-- updated_at touch
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

drop trigger if exists settings_updated_at on public.settings;
create trigger settings_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Activity helper
-- ---------------------------------------------------------------------------
create or replace function public.log_activity(p_document_id uuid, p_action text, p_detail jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.activity_log (document_id, actor_id, action, detail)
  values (p_document_id, auth.uid(), p_action, coalesce(p_detail, '{}'::jsonb));
end;
$$;

revoke all on function public.log_activity(uuid, text, jsonb) from public;
grant execute on function public.log_activity(uuid, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Invite code check (for optional self-signup)
-- ---------------------------------------------------------------------------
create or replace function public.verify_invite_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  expected text;
begin
  select coalesce(data->>'invite_code', '') into expected from public.settings where id = 1;
  if expected is null or expected = '' then
    return false;
  end if;
  return lower(trim(p_code)) = lower(trim(expected));
end;
$$;

revoke all on function public.verify_invite_code(text) from public;
grant execute on function public.verify_invite_code(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admin: update another user's role / display_name
-- ---------------------------------------------------------------------------
create or replace function public.admin_update_profile(
  p_user_id uuid,
  p_role public.app_role default null,
  p_display_name text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Only admin can update profiles';
  end if;
  update public.profiles
  set
    role = coalesce(p_role, role),
    display_name = coalesce(nullif(trim(p_display_name), ''), display_name),
    updated_at = now()
  where id = p_user_id
  returning * into row;
  if row.id is null then
    raise exception 'Profile not found';
  end if;
  return row;
end;
$$;

revoke all on function public.admin_update_profile(uuid, public.app_role, text) from public;
grant execute on function public.admin_update_profile(uuid, public.app_role, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Status transition guard for regular users (RLS WITH CHECK helpers)
-- ---------------------------------------------------------------------------
create or replace function public.user_allowed_status(s public.doc_status)
returns boolean
language sql
immutable
as $$
  select s in ('draft'::public.doc_status, 'pending_approval'::public.doc_status);
$$;

-- ---------------------------------------------------------------------------
-- Seed settings (company defaults + invite code)
-- ---------------------------------------------------------------------------
insert into public.settings (id, data)
values (
  1,
  jsonb_build_object(
    'name', '9 Square Infra',
    'logo', '9 SQUARE INFRA',
    'tagline', 'Visualizing Spaces. Engineering Dreams.',
    'address', '1st Floor, Opp Bandhan Bank, JMR Hospital Road, RR Pet, Eluru - 534002, Andhra Pradesh',
    'branch', 'Vijayawada',
    'engineer', 'Er. Rahel Shaik',
    'qual', 'B-Tech (Civil)',
    'role', 'Civil Engineer & Interior Designer',
    'phone', '9393478247, 9948699399',
    'email', '9squareinfra9@gmail.com',
    'gstin', '',
    'web', '9squareinfra.github.io/9-Square-Infra',
    'city', 'Eluru',
    'bank', '',
    'invite_code', '9SQUARE-STAFF'
  )
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.settings enable row level security;
alter table public.activity_log enable row level security;

-- Profiles
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_manager_or_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles p where p.id = auth.uid())
  );

-- Settings: everyone authenticated can read; only admin writes
drop policy if exists "settings_select" on public.settings;
create policy "settings_select" on public.settings
  for select to authenticated
  using (true);

drop policy if exists "settings_update_admin" on public.settings;
create policy "settings_update_admin" on public.settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "settings_insert_admin" on public.settings;
create policy "settings_insert_admin" on public.settings
  for insert to authenticated
  with check (public.is_admin());

-- Documents
drop policy if exists "docs_select" on public.documents;
create policy "docs_select" on public.documents
  for select to authenticated
  using (created_by = auth.uid() or public.is_manager_or_admin());

drop policy if exists "docs_insert" on public.documents;
create policy "docs_insert" on public.documents
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      public.is_manager_or_admin()
      or public.user_allowed_status(status)
    )
  );

drop policy if exists "docs_update" on public.documents;
create policy "docs_update" on public.documents
  for update to authenticated
  using (
    public.is_manager_or_admin()
    or created_by = auth.uid()
  )
  with check (
    public.is_manager_or_admin()
    or (
      created_by = auth.uid()
      and public.user_allowed_status(status)
    )
  );

drop policy if exists "docs_delete_admin" on public.documents;
create policy "docs_delete_admin" on public.documents
  for delete to authenticated
  using (public.is_admin());

-- Activity log
drop policy if exists "activity_select" on public.activity_log;
create policy "activity_select" on public.activity_log
  for select to authenticated
  using (
    public.is_manager_or_admin()
    or actor_id = auth.uid()
    or exists (
      select 1 from public.documents d
      where d.id = activity_log.document_id and d.created_by = auth.uid()
    )
  );

drop policy if exists "activity_insert" on public.activity_log;
create policy "activity_insert" on public.activity_log
  for insert to authenticated
  with check (actor_id = auth.uid() or actor_id is null);

-- Grants
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
grant select, insert, update, delete on public.documents to authenticated;
grant select, update, insert on public.settings to authenticated;
grant select, insert on public.activity_log to authenticated;
grant usage, select on sequence public.activity_log_id_seq to authenticated;

-- Done
notify pgrst, 'reload schema';
