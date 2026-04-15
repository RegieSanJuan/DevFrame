create extension if not exists pgcrypto;

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
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
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_portfolios_updated_at on public.portfolios;

create trigger set_portfolios_updated_at
before update on public.portfolios
for each row
execute function public.set_updated_at();

alter table public.portfolios enable row level security;

drop policy if exists "Public can read published portfolios" on public.portfolios;

create policy "Public can read published portfolios"
on public.portfolios
for select
using (is_published = true);
