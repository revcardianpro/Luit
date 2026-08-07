-- Phase 11: Jobs & Opportunities
--
-- A "jobs" table for listings, same user-generated pattern as products
-- (migration 0004): any signed-in user can create/edit/delete their own
-- listings, public read, no moderation system yet. Directory only --
-- applying happens off-platform via apply_url/apply_email, no in-app
-- application tracking.
--
-- One difference from products: job listings can expire (a closing
-- date), and expired ones are hidden from public browsing but stay
-- visible to their owner -- handled by two separate SELECT policies
-- below rather than filtering in application code, so it's enforced
-- at the database level no matter what queries the future.

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  company text not null,
  description text not null,
  job_type text not null,
  location text,
  salary_range text,
  apply_url text,
  apply_email text,
  expires_at timestamptz,
  constraint has_apply_method check (apply_url is not null or apply_email is not null),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

-- Two SELECT policies, OR'd together by Postgres RLS: the public sees
-- only active (non-expired) listings, while an owner can always see
-- their own regardless of expiry (e.g. to review or repost it).
create policy "Active job listings are publicly viewable"
  on public.jobs for select
  using (expires_at is null or expires_at > now());

create policy "Users can view their own listings including expired"
  on public.jobs for select
  using (auth.uid() = poster_id);

create policy "Users can create their own listings"
  on public.jobs for insert
  with check (auth.uid() = poster_id);

create policy "Users can update their own listings"
  on public.jobs for update
  using (auth.uid() = poster_id)
  with check (auth.uid() = poster_id);

create policy "Users can delete their own listings"
  on public.jobs for delete
  using (auth.uid() = poster_id);

create trigger on_job_updated
  before update on public.jobs
  for each row execute function public.handle_updated_at();
