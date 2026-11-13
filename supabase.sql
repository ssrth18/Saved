-- =====================================================================
--  SAVED  -  Supabase schema (run once in: Dashboard > SQL Editor > New query)
--  Each user only ever sees their own rows (Row Level Security).
-- =====================================================================

-- 1) Items: one row per saved card. The whole card lives in "data" (jsonb),
--    so adding new fields to the app never needs a migration.
create table if not exists public.saved_items (
  user_id        uuid        not null default auth.uid()
                             references auth.users(id) on delete cascade,
  id             text        not null,
  data           jsonb       not null default '{}'::jsonb,
  deleted        boolean     not null default false,   -- tombstone, so deletes sync to other devices
  client_updated bigint      not null default 0,        -- ms timestamp from the device (last write wins)
  synced_at      timestamptz not null default now(),    -- set by the server, used to pull changes
  primary key (user_id, id)
);
create index if not exists saved_items_pull_idx on public.saved_items (user_id, synced_at);

-- 2) Settings: one row per user (look, categories colours/order, ...)
create table if not exists public.saved_settings (
  user_id        uuid        primary key default auth.uid()
                             references auth.users(id) on delete cascade,
  data           jsonb       not null default '{}'::jsonb,
  client_updated bigint      not null default 0,
  synced_at      timestamptz not null default now()
);

-- 3) Server-side timestamp on every insert/update
create or replace function public.saved_touch()
returns trigger language plpgsql as $$
begin
  new.synced_at := now();
  return new;
end $$;

drop trigger if exists saved_items_touch    on public.saved_items;
create trigger saved_items_touch    before insert or update on public.saved_items
  for each row execute function public.saved_touch();

drop trigger if exists saved_settings_touch on public.saved_settings;
create trigger saved_settings_touch before insert or update on public.saved_settings
  for each row execute function public.saved_touch();

-- 4) Row Level Security: nobody can read or write someone else's data
alter table public.saved_items    enable row level security;
alter table public.saved_settings enable row level security;

drop policy if exists "own items"    on public.saved_items;
create policy "own items" on public.saved_items
  for all to authenticated
  using      ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "own settings" on public.saved_settings;
create policy "own settings" on public.saved_settings
  for all to authenticated
  using      ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Optional housekeeping: forget deleted rows older than 90 days
-- (run manually, or schedule it with pg_cron)
-- delete from public.saved_items where deleted and synced_at < now() - interval '90 days';
