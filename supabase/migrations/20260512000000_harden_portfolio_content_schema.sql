-- Harden shared portfolio content storage used by Builder, Studio, and public portfolios.
-- These are safe additions only. NOT VALID constraints avoid rejecting legacy rows
-- while still enforcing the rules for future writes.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_projects_display_order_nonnegative'
      and conrelid = 'public.portfolio_projects'::regclass
  ) then
    alter table public.portfolio_projects
      add constraint portfolio_projects_display_order_nonnegative
      check (display_order >= 0) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_experience_display_order_nonnegative'
      and conrelid = 'public.portfolio_experience'::regclass
  ) then
    alter table public.portfolio_experience
      add constraint portfolio_experience_display_order_nonnegative
      check (display_order >= 0) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_recommendations_display_order_nonnegative'
      and conrelid = 'public.portfolio_recommendations'::regclass
  ) then
    alter table public.portfolio_recommendations
      add constraint portfolio_recommendations_display_order_nonnegative
      check (display_order >= 0) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_assets_display_order_nonnegative'
      and conrelid = 'public.portfolio_assets'::regclass
  ) then
    alter table public.portfolio_assets
      add constraint portfolio_assets_display_order_nonnegative
      check (display_order >= 0) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_assets_avatar_display_order_check'
      and conrelid = 'public.portfolio_assets'::regclass
  ) then
    alter table public.portfolio_assets
      add constraint portfolio_assets_avatar_display_order_check
      check (kind <> 'avatar' or display_order = 0) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_assets_gallery_display_order_limit'
      and conrelid = 'public.portfolio_assets'::regclass
  ) then
    alter table public.portfolio_assets
      add constraint portfolio_assets_gallery_display_order_limit
      check (kind <> 'gallery-image' or display_order between 0 and 5) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_sections_display_order_nonnegative'
      and conrelid = 'public.portfolio_sections'::regclass
  ) then
    alter table public.portfolio_sections
      add constraint portfolio_sections_display_order_nonnegative
      check (display_order >= 0) not valid;
  end if;
end $$;

create index if not exists portfolios_published_slug_idx
  on public.portfolios(slug)
  where is_published;

do $$
begin
  if not exists (
    select 1
    from pg_class relation
    join pg_namespace namespace on namespace.oid = relation.relnamespace
    where relation.relkind = 'i'
      and relation.relname = 'portfolio_assets_portfolio_kind_order_unique_idx'
      and namespace.nspname = 'public'
  ) and not exists (
    select 1
    from (
      select portfolio_id, kind, display_order
      from public.portfolio_assets
      group by portfolio_id, kind, display_order
      having count(*) > 1
    ) duplicate_asset_orders
  ) then
    execute 'create unique index portfolio_assets_portfolio_kind_order_unique_idx on public.portfolio_assets(portfolio_id, kind, display_order)';
  end if;
end $$;

create index if not exists portfolio_sections_portfolio_type_idx
  on public.portfolio_sections(portfolio_id, section_type);

create index if not exists portfolio_recommendations_portfolio_featured_order_idx
  on public.portfolio_recommendations(portfolio_id, is_featured desc, display_order);
