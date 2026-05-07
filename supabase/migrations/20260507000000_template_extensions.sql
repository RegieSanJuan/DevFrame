-- ─────────────────────────────────────────────────────────────────
-- Migration: template_extensions
-- Adds template_settings JSONB column to portfolios and creates
-- the portfolio_sections table for optional per-template content.
-- All changes are strictly additive — zero breaking changes.
-- ─────────────────────────────────────────────────────────────────

-- 1. Add template_settings JSONB escape hatch to portfolios.
--    Stores UI/presentation preferences per template (e.g. defaultMode,
--    accentOverride). NOT used for user content. Defaults to empty object
--    so all existing rows are unaffected.
alter table public.portfolios
  add column if not exists template_settings jsonb not null default '{}'::jsonb;

-- 2. Create portfolio_sections for optional structured content sections
--    that only some templates surface (e.g. stat_bar, cta_block,
--    certifications). Templates query only the section_type values they
--    support and ignore the rest — new AI-generated templates can declare
--    brand-new section_type strings without any further migrations.
create table if not exists public.portfolio_sections (
  id            uuid        primary key default gen_random_uuid(),
  portfolio_id  uuid        not null references public.portfolios(id) on delete cascade,
  section_type  text        not null,
  display_order integer     not null default 0,
  is_enabled    boolean     not null default true,
  data          jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default timezone('utc', now()),
  updated_at    timestamptz not null default timezone('utc', now()),
  -- section_type must be a valid snake_case identifier so templates can
  -- safely match against it with string equality.
  constraint portfolio_sections_section_type_format
    check (section_type ~ '^[a-z][a-z0-9_]*$')
);

create index if not exists portfolio_sections_portfolio_order_idx
  on public.portfolio_sections(portfolio_id, display_order);

-- 3. updated_at auto-trigger for portfolio_sections.
drop trigger if exists set_portfolio_sections_updated_at on public.portfolio_sections;
create trigger set_portfolio_sections_updated_at
before update on public.portfolio_sections
for each row
execute function public.set_updated_at();

-- 4. Row-level security.
alter table public.portfolio_sections enable row level security;

drop policy if exists "Public can read published portfolio sections" on public.portfolio_sections;
create policy "Public can read published portfolio sections"
on public.portfolio_sections
for select
using (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_sections.portfolio_id
      and portfolios.is_published = true
  )
);
