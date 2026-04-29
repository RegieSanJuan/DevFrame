create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  clerk_user_id text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolios'
      and column_name = 'clerk_user_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolios'
      and column_name = 'owner_clerk_user_id'
  ) then
    alter table public.portfolios rename column clerk_user_id to owner_clerk_user_id;
  end if;
end;
$$;

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  owner_clerk_user_id text not null,
  slug text not null unique,
  template_slug text not null,
  full_name text not null,
  title text not null,
  location text not null,
  email text not null,
  bio text not null,
  about text not null,
  availability text not null default 'Open to opportunities',
  skills text[] not null default '{}',
  github_url text not null,
  linkedin_url text not null,
  website_url text,
  featured_project_name text not null,
  featured_project_summary text not null,
  featured_project_stack text not null,
  featured_project_url text,
  is_primary boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.portfolios
  add column if not exists owner_clerk_user_id text;

alter table public.portfolios
  add column if not exists is_primary boolean not null default false;

insert into public.profiles (clerk_user_id)
select distinct owner_clerk_user_id
from public.portfolios
where owner_clerk_user_id is not null
on conflict (clerk_user_id) do nothing;

with ranked_portfolios as (
  select
    id,
    row_number() over (
      partition by owner_clerk_user_id
      order by updated_at desc, created_at desc, id desc
    ) as row_rank
  from public.portfolios
  where owner_clerk_user_id is not null
)
update public.portfolios
set is_primary = ranked_portfolios.row_rank = 1
from ranked_portfolios
where ranked_portfolios.id = public.portfolios.id;

alter table public.portfolios drop constraint if exists portfolios_clerk_user_id_key;
alter table public.portfolios drop constraint if exists portfolios_owner_clerk_user_id_key;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolios_owner_clerk_user_id_fkey'
      and conrelid = 'public.portfolios'::regclass
  ) then
    alter table public.portfolios
      add constraint portfolios_owner_clerk_user_id_fkey
      foreign key (owner_clerk_user_id)
      references public.profiles(clerk_user_id)
      on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolios_slug_format'
      and conrelid = 'public.portfolios'::regclass
  ) then
    alter table public.portfolios
      add constraint portfolios_slug_format
      check (slug ~ '^[a-z0-9-]+$');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolios_slug_length'
      and conrelid = 'public.portfolios'::regclass
  ) then
    alter table public.portfolios
      add constraint portfolios_slug_length
      check (char_length(slug) between 3 and 32);
  end if;
end;
$$;

alter table public.portfolios
  alter column owner_clerk_user_id set not null;

create unique index if not exists portfolios_primary_per_owner_idx
  on public.portfolios(owner_clerk_user_id)
  where is_primary;

create index if not exists portfolios_owner_updated_at_idx
  on public.portfolios(owner_clerk_user_id, updated_at desc);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  display_order integer not null default 0,
  name text not null,
  summary text not null,
  stack text[] not null default '{}',
  project_url text,
  repo_url text,
  image_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists portfolio_projects_portfolio_order_idx
  on public.portfolio_projects(portfolio_id, display_order);

create table if not exists public.portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  display_order integer not null default 0,
  year_label text not null,
  role text not null,
  company text not null,
  summary text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists portfolio_experience_portfolio_order_idx
  on public.portfolio_experience(portfolio_id, display_order);

create table if not exists public.portfolio_recommendations (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  display_order integer not null default 0,
  quote text not null,
  author text not null,
  role text not null,
  company text,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists portfolio_recommendations_portfolio_order_idx
  on public.portfolio_recommendations(portfolio_id, display_order);

create table if not exists public.portfolio_assets (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  kind text not null default 'gallery-image',
  bucket text not null default 'portfolio-assets',
  storage_path text not null,
  public_url text,
  alt_text text,
  caption text,
  display_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_assets_kind_check'
      and conrelid = 'public.portfolio_assets'::regclass
  ) then
    alter table public.portfolio_assets
      add constraint portfolio_assets_kind_check
      check (kind in ('avatar', 'cover', 'gallery-image', 'project-image', 'resume'));
  end if;
end;
$$;

create index if not exists portfolio_assets_portfolio_order_idx
  on public.portfolio_assets(portfolio_id, display_order);

create table if not exists public.portfolio_domains (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  hostname text not null unique,
  is_primary boolean not null default false,
  verification_status text not null default 'pending',
  ssl_status text not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_domains_verification_status_check'
      and conrelid = 'public.portfolio_domains'::regclass
  ) then
    alter table public.portfolio_domains
      add constraint portfolio_domains_verification_status_check
      check (verification_status in ('pending', 'verified', 'failed'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_domains_ssl_status_check'
      and conrelid = 'public.portfolio_domains'::regclass
  ) then
    alter table public.portfolio_domains
      add constraint portfolio_domains_ssl_status_check
      check (ssl_status in ('pending', 'provisioning', 'ready', 'failed'));
  end if;
end;
$$;

create unique index if not exists portfolio_domains_primary_per_portfolio_idx
  on public.portfolio_domains(portfolio_id)
  where is_primary;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_portfolios_updated_at on public.portfolios;
create trigger set_portfolios_updated_at
before update on public.portfolios
for each row
execute function public.set_updated_at();

drop trigger if exists set_portfolio_projects_updated_at on public.portfolio_projects;
create trigger set_portfolio_projects_updated_at
before update on public.portfolio_projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_portfolio_experience_updated_at on public.portfolio_experience;
create trigger set_portfolio_experience_updated_at
before update on public.portfolio_experience
for each row
execute function public.set_updated_at();

drop trigger if exists set_portfolio_recommendations_updated_at on public.portfolio_recommendations;
create trigger set_portfolio_recommendations_updated_at
before update on public.portfolio_recommendations
for each row
execute function public.set_updated_at();

drop trigger if exists set_portfolio_assets_updated_at on public.portfolio_assets;
create trigger set_portfolio_assets_updated_at
before update on public.portfolio_assets
for each row
execute function public.set_updated_at();

drop trigger if exists set_portfolio_domains_updated_at on public.portfolio_domains;
create trigger set_portfolio_domains_updated_at
before update on public.portfolio_domains
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_experience enable row level security;
alter table public.portfolio_recommendations enable row level security;
alter table public.portfolio_assets enable row level security;
alter table public.portfolio_domains enable row level security;

drop policy if exists "Public can read published portfolios" on public.portfolios;
create policy "Public can read published portfolios"
on public.portfolios
for select
using (is_published = true);

drop policy if exists "Public can read published portfolio projects" on public.portfolio_projects;
create policy "Public can read published portfolio projects"
on public.portfolio_projects
for select
using (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_projects.portfolio_id
      and portfolios.is_published = true
  )
);

drop policy if exists "Public can read published portfolio experience" on public.portfolio_experience;
create policy "Public can read published portfolio experience"
on public.portfolio_experience
for select
using (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_experience.portfolio_id
      and portfolios.is_published = true
  )
);

drop policy if exists "Public can read published portfolio recommendations" on public.portfolio_recommendations;
create policy "Public can read published portfolio recommendations"
on public.portfolio_recommendations
for select
using (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_recommendations.portfolio_id
      and portfolios.is_published = true
  )
);

drop policy if exists "Public can read published portfolio assets" on public.portfolio_assets;
create policy "Public can read published portfolio assets"
on public.portfolio_assets
for select
using (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_assets.portfolio_id
      and portfolios.is_published = true
  )
);

drop policy if exists "Public can read published portfolio domains" on public.portfolio_domains;
create policy "Public can read published portfolio domains"
on public.portfolio_domains
for select
using (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_domains.portfolio_id
      and portfolios.is_published = true
  )
);
