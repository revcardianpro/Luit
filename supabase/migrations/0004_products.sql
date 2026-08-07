-- Phase 9: Marketplace
--
-- A "products" table for seller listings, plus a storage bucket for
-- listing photos. Unlike Explore/Pride (curated content, seeded by us),
-- this is genuine user-generated content: any signed-in user can create,
-- edit, and delete their own listings. No moderation system exists yet
-- (that's Phase 16) -- accepted trade-off per the user's explicit choice.
--
-- Directory/showcase only: no cart, no checkout, no payments. Buyers
-- reach sellers via contact_email/contact_phone on the listing itself
-- (not the seller's private account email, which isn't queryable by
-- other users anyway -- auth.users is never exposed to the anon client).

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  district text,
  image_path text,
  contact_email text,
  contact_phone text,
  -- A listing needs at least one way for a buyer to actually reach the
  -- seller, or "Contact seller" would have nothing to show.
  constraint has_contact_method check (contact_email is not null or contact_phone is not null),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Products are publicly viewable"
  on public.products for select
  using (true);

create policy "Users can create their own listings"
  on public.products for insert
  with check (auth.uid() = seller_id);

create policy "Users can update their own listings"
  on public.products for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

create policy "Users can delete their own listings"
  on public.products for delete
  using (auth.uid() = seller_id);

create trigger on_product_updated
  before update on public.products
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------
-- Listing photo storage
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('listings', 'listings', true);

create policy "Listing images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'listings');

-- Files stored as "{user_id}/{listing_id}.<ext>" -- same ownership
-- pattern as the avatars bucket in migration 0001.
create policy "Users can upload their own listing images"
  on storage.objects for insert
  with check (
    bucket_id = 'listings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own listing images"
  on storage.objects for update
  using (
    bucket_id = 'listings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own listing images"
  on storage.objects for delete
  using (
    bucket_id = 'listings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
