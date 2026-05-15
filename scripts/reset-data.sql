-- DevFrame: Reset all app data while preserving schema, RLS, indexes, triggers.
-- Uses a single TRUNCATE with CASCADE to respect FK ordering automatically.
-- RESTART IDENTITY resets any internal sequences.

BEGIN;

TRUNCATE TABLE
  public.portfolio_domains,
  public.portfolio_sections,
  public.portfolio_assets,
  public.portfolio_recommendations,
  public.portfolio_experience,
  public.portfolio_projects,
  public.portfolios,
  public.profiles
  RESTART IDENTITY CASCADE;

COMMIT;
