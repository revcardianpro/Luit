-- Phase 14: Search
--
-- Site-wide full-text search across every content type on LUIT, using
-- Postgres's built-in full-text search -- free, already part of
-- Supabase, no new vendor (see luit-budget-constraint project memory).
--
-- Each searchable table gets a generated `search_vector` tsvector
-- column: Postgres derives and maintains it automatically from the
-- listed source columns on every insert/update (`generated always as
-- ... stored`), so there's no app-side code keeping it in sync. Each
-- column is weighted -- 'A' (title/name) ranks above 'B' (category-ish
-- fields) which ranks above 'C' (long-form description) -- so a title
-- match surfaces before a passing mention buried in a description.
-- A GIN index makes the actual `@@` match fast.
--
-- No RLS changes needed: every one of these tables already has a
-- public-read SELECT policy (jobs/events additionally scope it to
-- non-expired/non-past rows), so a search query through the regular
-- anon-key client automatically respects the same visibility rules as
-- that table's own listing page -- nothing search-specific to filter.

alter table public.destinations add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '') || ' ' || coalesce(district, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(short_description, '') || ' ' || coalesce(description, '')), 'C')
  ) stored;
create index destinations_search_idx on public.destinations using gin (search_vector);

alter table public.notable_people add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(field, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(short_description, '') || ' ' || coalesce(description, '')), 'C')
  ) stored;
create index notable_people_search_idx on public.notable_people using gin (search_vector);

alter table public.products add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '') || ' ' || coalesce(district, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;
create index products_search_idx on public.products using gin (search_vector);

alter table public.learning_resources add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(provider, '') || ' ' || coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(short_description, '') || ' ' || coalesce(description, '')), 'C')
  ) stored;
create index learning_resources_search_idx on public.learning_resources using gin (search_vector);

alter table public.jobs add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(company, '') || ' ' || coalesce(job_type, '') || ' ' || coalesce(location, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;
create index jobs_search_idx on public.jobs using gin (search_vector);

alter table public.government_opportunities add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(organization, '') || ' ' || coalesce(listing_type, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;
create index government_opportunities_search_idx on public.government_opportunities using gin (search_vector);

alter table public.creator_posts add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;
create index creator_posts_search_idx on public.creator_posts using gin (search_vector);

alter table public.events add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '') || ' ' || coalesce(location, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;
create index events_search_idx on public.events using gin (search_vector);

alter table public.assam_events_feed add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '') || ' ' || coalesce(location, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;
create index assam_events_feed_search_idx on public.assam_events_feed using gin (search_vector);
