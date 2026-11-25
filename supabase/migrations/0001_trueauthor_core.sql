-- TrueAuthor core schema. Idempotent and namespaced with the ta_ prefix so it can be
-- applied to an existing Supabase project without touching other apps' tables.
-- Run in: Supabase Dashboard > SQL Editor.

create table if not exists public.ta_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  institution text,
  role text not null default 'student' check (role in ('student','lecturer','researcher','publisher','administrator','other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ta_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  content text not null,
  source_type text not null default 'paste' check (source_type in ('paste','txt','pdf','docx')),
  word_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists ta_documents_owner_idx on public.ta_documents(owner_id, created_at desc);

create table if not exists public.ta_analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.ta_documents(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','processing','completed','failed')),
  similarity_percent numeric(5,2),
  sources_compared integer not null default 0,
  matches jsonb not null default '[]'::jsonb,
  options jsonb not null default '{}'::jsonb,
  error text,
  reference text not null default ('TA-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists ta_jobs_owner_idx on public.ta_analysis_jobs(owner_id, created_at desc);

create table if not exists public.ta_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists ta_activity_user_idx on public.ta_activity_logs(user_id, created_at desc);

create table if not exists public.ta_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Written only by the server (Selar webhook with the service role). Users can read their own row.
create table if not exists public.ta_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null,
  status text not null check (status in ('active','cancelled','expired')),
  selar_reference text unique,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- Row Level Security: every row is visible only to its owner.
alter table public.ta_profiles enable row level security;
alter table public.ta_documents enable row level security;
alter table public.ta_analysis_jobs enable row level security;
alter table public.ta_activity_logs enable row level security;
alter table public.ta_notifications enable row level security;
alter table public.ta_subscriptions enable row level security;

do $$
declare t text;
begin
  -- profiles
  drop policy if exists ta_profiles_select on public.ta_profiles;
  drop policy if exists ta_profiles_insert on public.ta_profiles;
  drop policy if exists ta_profiles_update on public.ta_profiles;
  create policy ta_profiles_select on public.ta_profiles for select using (auth.uid() = id);
  create policy ta_profiles_insert on public.ta_profiles for insert with check (auth.uid() = id);
  create policy ta_profiles_update on public.ta_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

  foreach t in array array['ta_documents','ta_analysis_jobs'] loop
    execute format('drop policy if exists %I on public.%I', t||'_owner_all', t);
    execute format('create policy %I on public.%I for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id)', t||'_owner_all', t);
  end loop;

  drop policy if exists ta_activity_select on public.ta_activity_logs;
  drop policy if exists ta_activity_insert on public.ta_activity_logs;
  create policy ta_activity_select on public.ta_activity_logs for select using (auth.uid() = user_id);
  create policy ta_activity_insert on public.ta_activity_logs for insert with check (auth.uid() = user_id);

  drop policy if exists ta_notifications_select on public.ta_notifications;
  drop policy if exists ta_notifications_update on public.ta_notifications;
  create policy ta_notifications_select on public.ta_notifications for select using (auth.uid() = user_id);
  create policy ta_notifications_update on public.ta_notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

  drop policy if exists ta_subscriptions_select on public.ta_subscriptions;
  create policy ta_subscriptions_select on public.ta_subscriptions for select using (auth.uid() = user_id);
end $$;

-- Create a profile automatically on sign up. The app also creates one lazily, so sign in
-- works even if this trigger is removed. Uniquely named to avoid clashing with other apps.
create or replace function public.ta_handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.ta_profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
exception when others then
  return new; -- never block sign up because of profile creation
end $$;

drop trigger if exists ta_on_auth_user_created on auth.users;
create trigger ta_on_auth_user_created after insert on auth.users
  for each row execute function public.ta_handle_new_user();
