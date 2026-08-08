-- Phase 15: Admin Dashboard
--
-- Gives admins a CRUD UI for the four curated content tables that have
-- been read-only-through-the-app since they were created (see the
-- "Phase 15" comments in 0002_destinations.sql and
-- 0007_government_opportunities.sql -- notable_people and
-- learning_resources follow the identical pattern, just without an
-- explicit comment saying so).
--
-- One boolean, not a roles table: this app has a single admin (the
-- owner) for now, and a full permissions system would be solving a
-- problem that doesn't exist yet. Nobody can self-service into this --
-- it's set directly via the service-role client, never through a
-- user-facing form.

alter table public.profiles add column is_admin boolean not null default false;

-- Small helper so every admin-gated policy below (and any future one)
-- reads the same one-liner instead of repeating the subquery. SECURITY
-- DEFINER so it can read `profiles` regardless of the caller's own RLS
-- visibility into that table; STABLE since it doesn't modify anything
-- and can be safely cached within one query.
create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create policy "Admins can create destinations"
  on public.destinations for insert
  with check (public.is_admin());

create policy "Admins can update destinations"
  on public.destinations for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete destinations"
  on public.destinations for delete
  using (public.is_admin());

create policy "Admins can create notable people"
  on public.notable_people for insert
  with check (public.is_admin());

create policy "Admins can update notable people"
  on public.notable_people for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete notable people"
  on public.notable_people for delete
  using (public.is_admin());

create policy "Admins can create learning resources"
  on public.learning_resources for insert
  with check (public.is_admin());

create policy "Admins can update learning resources"
  on public.learning_resources for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete learning resources"
  on public.learning_resources for delete
  using (public.is_admin());

create policy "Admins can create government opportunities"
  on public.government_opportunities for insert
  with check (public.is_admin());

create policy "Admins can update government opportunities"
  on public.government_opportunities for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete government opportunities"
  on public.government_opportunities for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- Pride of Assam photo storage
-- ---------------------------------------------------------------------
--
-- The 5 seeded notable_people rows point at static files checked into
-- public/images/pride/ -- fine for a one-time seed, but a deployed
-- Next.js app's public/ folder is immutable at runtime, so an admin
-- upload can't write there. New/replaced photos from the admin UI go
-- to this bucket instead; photo_path just becomes a full storage URL
-- for those rows rather than a relative /images/pride/... path. The
-- original 5 seeded photos keep working unchanged either way, since
-- the app already just renders whatever string is in photo_path.

insert into storage.buckets (id, name, public)
values ('pride-photos', 'pride-photos', true);

create policy "Pride photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'pride-photos');

create policy "Admins can upload pride photos"
  on storage.objects for insert
  with check (bucket_id = 'pride-photos' and public.is_admin());

create policy "Admins can update pride photos"
  on storage.objects for update
  using (bucket_id = 'pride-photos' and public.is_admin());

create policy "Admins can delete pride photos"
  on storage.objects for delete
  using (bucket_id = 'pride-photos' and public.is_admin());
