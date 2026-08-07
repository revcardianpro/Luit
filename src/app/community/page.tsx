import { createClient } from "@/lib/supabase/server";
import type { CreatorPostWithMeta } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { PostCard } from "./PostCard";

// Raw shape PostgREST returns for embedded count aggregates, before we
// flatten it into CreatorPostWithMeta's plain like_count/comment_count.
interface RawPostRow extends Omit<CreatorPostWithMeta, "like_count" | "comment_count"> {
  creator_post_likes: { count: number }[];
  creator_post_comments: { count: number }[];
}

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("creator_posts")
    .select(
      // "profiles!creator_posts_creator_id_fkey" (not just "profiles")
      // -- creator_posts now has *two* paths to profiles (this direct
      // FK, and an indirect one through creator_post_likes/comments),
      // so PostgREST can't infer which one is meant without the
      // explicit foreign-key hint. Without it, this query fails
      // outright with a PGRST201 "more than one relationship" error.
      "*, profiles!creator_posts_creator_id_fkey(full_name, avatar_url), creator_post_likes(count), creator_post_comments(count)",
    )
    .order("created_at", { ascending: false });

  const posts: CreatorPostWithMeta[] = ((data ?? []) as unknown as RawPostRow[]).map((row) => ({
    ...row,
    like_count: row.creator_post_likes[0]?.count ?? 0,
    comment_count: row.creator_post_comments[0]?.count ?? 0,
  }));

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Creator Community
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Photography, music, art, writing, and craft — made by creators from Assam.
        </p>
        <Button href="/community/new">Share Your Work</Button>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-foreground/60">
            No posts yet — be the first to share your work.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
