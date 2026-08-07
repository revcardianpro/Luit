-- Phase 6: User Profiles
--
-- One profiles row per auth user, plus a storage bucket for avatar
-- images. Run this once in the Supabase SQL Editor (Dashboard ->
-- SQL Editor -> New query -> paste -> Run).

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security is OFF by default privilege-wise once enabled below
-- -- meaning with no policies, NO ONE (other than admin/service-role
-- access) can read or write this table. Every line of access has to be
-- explicitly granted by a policy; that's what makes RLS the actual
-- security boundary here, not just a nice-to-have.
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No INSERT policy for regular users on purpose -- profile rows are only
-- ever created by the trigger below, never directly by a client.

-- ---------------------------------------------------------------------
-- Auto-create a profile row when a user signs up
-- ---------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at current on every edit.
create function public.handle_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_profile_updated_at();

-- ---------------------------------------------------------------------
-- Avatar storage
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Bucket is public, but storage.objects still needs its own policy for
-- reads to actually be allowed through the API.
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Files are stored as "{user_id}/avatar.<ext>" -- these policies check
-- that the first path segment matches the uploader's own user id, so
-- nobody can overwrite or delete someone else's avatar.
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
