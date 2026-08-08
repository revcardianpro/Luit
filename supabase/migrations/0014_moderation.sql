-- Phase 16: Moderation System
--
-- One shared `reports` table for all five user-generated content types
-- (creator posts, creator post comments, marketplace products, jobs,
-- events) rather than five near-identical report tables. `content_id`
-- is a plain uuid with no foreign key -- it can't reference five
-- different tables at once, so referential integrity here is
-- enforced in application code (see src/lib/admin-content-lookup.ts,
-- which treats a missing row as "already removed" rather than
-- erroring).
--
-- Reporting requires being signed in (no anonymous reports -- keeps
-- the reporter accountable and matches every other write path on the
-- site). Any signed-in user can report; only admins can see the full
-- queue or act on it.

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  content_type text not null check (
    content_type in ('creator_post', 'creator_post_comment', 'product', 'job', 'event')
  ),
  content_id uuid not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles (id)
);

alter table public.reports enable row level security;

create policy "Users can create reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Reporters can view their own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

create policy "Admins can view all reports"
  on public.reports for select
  using (public.is_admin());

create policy "Admins can update reports"
  on public.reports for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Admin override on the five moderated tables
-- ---------------------------------------------------------------------
--
-- Until now only a row's own owner could delete it. A report is
-- useless if nobody but the owner can act on it, so admins get delete
-- rights across all five tables (public.is_admin(), from migration
-- 0013) -- this OR's together with the existing owner-only policy,
-- same pattern jobs already uses for its two SELECT policies.
--
-- jobs and events also get an admin SELECT override: their public-read
-- policies hide expired/past rows from everyone but the owner, which
-- would make an admin unable to even see a reported listing that has
-- since expired.

create policy "Admins can delete any creator post"
  on public.creator_posts for delete
  using (public.is_admin());

create policy "Admins can delete any creator post comment"
  on public.creator_post_comments for delete
  using (public.is_admin());

create policy "Admins can delete any product"
  on public.products for delete
  using (public.is_admin());

create policy "Admins can delete any job"
  on public.jobs for delete
  using (public.is_admin());

create policy "Admins can view all jobs"
  on public.jobs for select
  using (public.is_admin());

create policy "Admins can delete any event"
  on public.events for delete
  using (public.is_admin());

create policy "Admins can view all events"
  on public.events for select
  using (public.is_admin());
