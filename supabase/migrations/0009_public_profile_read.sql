-- Bugfix, found during Phase 12 verification.
--
-- profiles' only SELECT policy (from migration 0001) was "Users can
-- view their own profile" -- correct for Phase 6, when profiles were
-- private ("my account" only). Since then, Marketplace, Jobs, and
-- Creator Community all display a listing's seller/poster/creator name
-- via a `profiles(full_name, avatar_url)` embed -- which silently
-- returns null for anyone other than the profile's own owner, because
-- RLS was never updated to allow public read.
--
-- This is a *quiet* bug (missing name, not a crash) on Marketplace and
-- Jobs; on Creator Community it combined with a separate ambiguous-FK
-- issue (fixed in application code, not here) to cause an outright 404
-- for non-owners. Both are effects of the same root cause: profiles
-- needs to be publicly readable now that other people's names are
-- meant to be shown across the site.
--
-- Adding a new public SELECT policy rather than replacing the existing
-- owner-only one -- Postgres RLS policies are OR'd together, so this
-- makes the table fully publicly readable without needing to touch
-- (or risk breaking) the original policy.

create policy "Profiles are publicly viewable"
  on public.profiles for select
  using (true);
