-- Phase 13 addendum: Assam Events Feed
--
-- A curated, machine-discovered feed of trending/upcoming events in Assam --
-- deliberately separate from the `events` table (community-submitted,
-- migration 0010). Nobody -- not even a signed-in user -- can write to
-- this table through the app: there are no insert/update/delete
-- policies at all. The only writer is the /api/cron/refresh-assam-events
-- route, authenticated with the Supabase service role key, which
-- bypasses RLS entirely by design. Public read access only.
--
-- Refreshed by wiping and re-inserting the whole table on each cron
-- run (see the route for why: this is a live "trending/upcoming"
-- snapshot, not an archive, so there's no need for dedup/upsert logic).
--
-- date_text is required and always human-readable (e.g. "Mid-August
-- 2026" or "Annual, dates vary") -- like government_opportunities'
-- key_dates -- because dates extracted from scraped/summarized web
-- content are often approximate. starts_at is only set when a clean
-- date was actually extractable, for sorting.

create table public.assam_events_feed (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  location text,
  date_text text not null,
  starts_at timestamptz,
  source_url text not null,
  source_name text not null,
  discovered_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.assam_events_feed enable row level security;

create policy "Assam events feed is publicly viewable"
  on public.assam_events_feed for select
  using (true);
