-- Homepage redesign v2: admin-editable site settings.
--
-- A singleton table (exactly one row, always) rather than a table per
-- setting or a generic key/value store -- there are only a handful of
-- fields, all edited together from one admin form, so a fixed-column
-- row is simpler than a KV table an app-side "get or default" wrapper
-- would need anyway. Scoped to just what this phase needs (the hero
-- story video + footer social links); more fields can be added as
-- plain columns later the same way.
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  -- A YouTube/Vimeo URL, not an uploaded file -- direct video file
  -- storage risks blowing through Supabase's free-tier storage/
  -- bandwidth cap, which conflicts with the project's $0 budget.
  -- Validated (parseable into an embed URL) at save time by
  -- src/lib/video-embed.ts, not by a DB constraint.
  story_video_url text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  youtube_url text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Public read -- the footer and hero need this signed-out too, same
-- as every other public-content table on the site.
create policy "Site settings are publicly viewable"
  on public.site_settings for select
  using (true);

-- Admin-only write. No insert/delete policy at all -- the one row is
-- seeded below and only ever updated, never replaced or removed.
create policy "Admins can update site settings"
  on public.site_settings for update
  using (public.is_admin())
  with check (public.is_admin());

create trigger on_site_settings_updated
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

-- Seed the single row, all fields null -- the app always reads/updates
-- this one row rather than handling a "no settings yet" empty state.
insert into public.site_settings default values;
