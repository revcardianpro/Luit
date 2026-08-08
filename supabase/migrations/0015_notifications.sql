-- Phase 17: Notifications.
--
-- One shared table for every notification type, same pattern as
-- `reports` (0014) -- rather than a table per trigger. `message` and
-- `content_href` are pre-rendered at insert time (not resolved by a
-- join at read time), so the /notifications page never needs to embed
-- `profiles` -- sidesteps the ambiguous-FK-embed failure mode that hit
-- both `creator_posts` (Phase 12) and `reports` (Phase 16), and means a
-- notification still reads fine even if the actor's account is later
-- deleted.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  -- Who/what caused it. Null for a system-initiated notification (not
  -- used yet, but cheaper to allow now than to migrate later).
  actor_id uuid references public.profiles (id) on delete set null,
  type text not null check (type in ('post_like', 'post_comment', 'content_removed')),
  message text not null,
  content_href text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_recipient_unread_idx
  on public.notifications (recipient_id, created_at desc)
  where read_at is null;

alter table public.notifications enable row level security;

-- Recipients only ever see their own notifications.
create policy "Recipients can view their own notifications"
  on public.notifications for select
  using (auth.uid() = recipient_id);

-- Insert is scoped to "you can only create a notification attributed
-- to yourself as the actor" -- covers both cases this phase needs:
-- a member liking/commenting (actor = themselves, recipient = someone
-- else), and an admin removing reported content (actor = the admin
-- performing the action, recipient = the content's owner). The actual
-- recipient/type/message content is built server-side in
-- src/lib/notifications.ts, not user-supplied.
create policy "Users can create notifications naming themselves as actor"
  on public.notifications for insert
  with check (auth.uid() = actor_id);

-- Recipients can mark their own notifications read (no delete policy
-- yet -- out of scope for this phase, nothing needs it).
create policy "Recipients can mark their own notifications read"
  on public.notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);
