create table if not exists public.connection_probe (
  id bigint generated always as identity primary key,
  label text not null default 'supabase-cli-test',
  created_at timestamptz not null default timezone('utc', now())
);

comment on table public.connection_probe is
  'Temporary probe table used to verify remote Supabase migrations from this repo.';
