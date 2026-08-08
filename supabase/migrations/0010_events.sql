-- Phase 13: Events
--
-- A directory of upcoming happenings (festivals, meetups, workshops,
-- cultural programs) -- same user-generated pattern as jobs/products/
-- creator_posts: any signed-in user creates/edits/deletes their own
-- listings, public read, no moderation system yet.
--
-- Directory only, like Jobs -- RSVP happens off-platform via
-- external_link, no in-app attendance tracking (deliberately scoped
-- down; see luit-feature-backlog project memory if that changes).
--
-- Two date columns, like Jobs' expires_at: starts_at is required,
-- ends_at is optional. "Upcoming" for public visibility is judged by
-- whichever is later -- an event without an end time is still
-- "upcoming" up through its start time, same logic as Jobs' expiry
-- check. Owners always see their own events, including past ones (to
-- review or reuse a listing).

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  image_path text,
  external_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_event_window check (ends_at is null or ends_at >= starts_at)
);

alter table public.events enable row level security;

-- Two SELECT policies, OR'd together by Postgres RLS -- same shape as
-- jobs' expiry split.
create policy "Upcoming events are publicly viewable"
  on public.events for select
  using (coalesce(ends_at, starts_at) >= now());

create policy "Users can view their own events including past"
  on public.events for select
  using (auth.uid() = organizer_id);

create policy "Users can create their own events"
  on public.events for insert
  with check (auth.uid() = organizer_id);

create policy "Users can update their own events"
  on public.events for update
  using (auth.uid() = organizer_id)
  with check (auth.uid() = organizer_id);

create policy "Users can delete their own events"
  on public.events for delete
  using (auth.uid() = organizer_id);

create trigger on_event_updated
  before update on public.events
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------
-- Event image storage
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('events', 'events', true);

create policy "Event images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'events');

create policy "Users can upload their own event images"
  on storage.objects for insert
  with check (
    bucket_id = 'events'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own event images"
  on storage.objects for update
  using (
    bucket_id = 'events'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own event images"
  on storage.objects for delete
  using (
    bucket_id = 'events'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
