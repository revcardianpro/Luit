-- Phase 12: Creator Community (core)
--
-- Scoped down from the user's original ask (which also included
-- Stories, video upload, and Direct Messaging) to: posts, likes, and
-- comments -- see the luit-feature-backlog project memory for why the
-- rest was deferred as separate follow-up work.
--
-- Same user-generated pattern as products/jobs: any signed-in user
-- creates/edits/deletes their own posts, public read, no moderation
-- system yet. Comments carry extra risk (higher-frequency public text
-- input than a listing) -- mitigated by letting the POST OWNER delete
-- comments on their own post, not just the comment's own author, as a
-- minimal moderation affordance until Phase 16 exists.

create table public.creator_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  image_path text,
  external_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.creator_posts enable row level security;

create policy "Posts are publicly viewable"
  on public.creator_posts for select
  using (true);

create policy "Users can create their own posts"
  on public.creator_posts for insert
  with check (auth.uid() = creator_id);

create policy "Users can update their own posts"
  on public.creator_posts for update
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

create policy "Users can delete their own posts"
  on public.creator_posts for delete
  using (auth.uid() = creator_id);

create trigger on_creator_post_updated
  before update on public.creator_posts
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------
-- Likes
-- ---------------------------------------------------------------------

-- Composite primary key (post_id, user_id) instead of a surrogate id --
-- it's the natural key here, and it makes "like twice" impossible at
-- the schema level rather than needing an application-side check.
create table public.creator_post_likes (
  post_id uuid not null references public.creator_posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.creator_post_likes enable row level security;

create policy "Likes are publicly viewable"
  on public.creator_post_likes for select
  using (true);

create policy "Users can like posts as themselves"
  on public.creator_post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own like"
  on public.creator_post_likes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Comments
-- ---------------------------------------------------------------------

create table public.creator_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.creator_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.creator_post_comments enable row level security;

create policy "Comments are publicly viewable"
  on public.creator_post_comments for select
  using (true);

create policy "Users can comment as themselves"
  on public.creator_post_comments for insert
  with check (auth.uid() = author_id);

-- Either the comment's own author OR the post's owner can delete a
-- comment -- the latter is the minimal moderation affordance mentioned
-- above (your post, you can remove replies on it).
create policy "Comment author or post owner can delete a comment"
  on public.creator_post_comments for delete
  using (
    auth.uid() = author_id
    or auth.uid() = (select creator_id from public.creator_posts where id = post_id)
  );

-- ---------------------------------------------------------------------
-- Post image storage
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('creator-posts', 'creator-posts', true);

create policy "Creator post images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'creator-posts');

create policy "Users can upload their own post images"
  on storage.objects for insert
  with check (
    bucket_id = 'creator-posts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own post images"
  on storage.objects for update
  using (
    bucket_id = 'creator-posts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own post images"
  on storage.objects for delete
  using (
    bucket_id = 'creator-posts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
