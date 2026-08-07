import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import type { CreatorPost, CreatorPostComment, Profile } from "@/lib/supabase/types";
import { getCreatorCategoryAccent } from "@/lib/creator-categories";
import { accentBgClass } from "@/lib/brand-accent";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { toggleLike, addComment } from "./actions";
import { ShareButton } from "./ShareButton";
import { DeletePostButton } from "./DeletePostButton";
import { DeleteCommentButton } from "./DeleteCommentButton";

export default async function PostPage(props: PageProps<"/community/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [postResult, commentsResult, likeCountResult, user] = await Promise.all([
    // Explicit FK hint needed here too -- see the comment in
    // src/app/community/page.tsx for why a plain "profiles(...)" embed
    // fails on this table specifically.
    supabase
      .from("creator_posts")
      .select("*, profiles!creator_posts_creator_id_fkey(full_name, avatar_url)")
      .eq("id", id)
      .single(),
    supabase
      .from("creator_post_comments")
      .select("*, profiles(full_name, avatar_url)")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("creator_post_likes").select("*", { count: "exact", head: true }).eq("post_id", id),
    getCurrentUser(),
  ]);

  const post = postResult.data as (CreatorPost & { profiles: Pick<Profile, "full_name" | "avatar_url"> | null }) | null;

  if (!post) {
    notFound();
  }

  const comments = (commentsResult.data ?? []) as CreatorPostComment[];
  const likeCount = likeCountResult.count ?? 0;
  const isOwner = user?.id === post.creator_id;

  let hasLiked = false;
  if (user) {
    const { data: likeRow } = await supabase
      .from("creator_post_likes")
      .select("post_id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    hasLiked = !!likeRow;
  }

  const accent = getCreatorCategoryAccent(post.category);
  const postUrl = `${getSiteUrl()}/community/${post.id}`;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/community"
        className="text-sm font-medium text-foreground/60 hover:text-foreground"
      >
        ← Back to Creator Community
      </Link>

      {post.image_path && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-foreground/5">
          <Image
            src={post.image_path}
            alt={post.title}
            fill
            sizes="768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {post.category}
        </p>
      </div>

      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      {post.profiles?.full_name && (
        <p className="mt-1 text-sm text-foreground/60">by {post.profiles.full_name}</p>
      )}

      <p className="mt-6 whitespace-pre-line text-foreground/80">{post.description}</p>

      {post.external_link && (
        <div className="mt-4">
          <Button href={post.external_link} external variant="outline" size="sm">
            View original ↗
          </Button>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <form action={toggleLike}>
          <input type="hidden" name="post_id" value={post.id} />
          <Button type="submit" variant={hasLiked ? "primary" : "outline"} size="sm">
            {hasLiked ? "♥ Liked" : "♡ Like"} ({likeCount})
          </Button>
        </form>
        <ShareButton url={postUrl} title={post.title} />
        {isOwner && (
          <>
            <Button href={`/community/${post.id}/edit`} variant="outline" size="sm">
              Edit
            </Button>
            <DeletePostButton postId={post.id} />
          </>
        )}
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-xl font-semibold">
          {comments.length} Comment{comments.length === 1 ? "" : "s"}
        </h2>

        {user ? (
          <form action={addComment} className="mt-4 flex flex-col gap-2">
            <input type="hidden" name="post_id" value={post.id} />
            <textarea
              name="body"
              required
              rows={2}
              placeholder="Add a comment..."
              className="rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
            <Button type="submit" size="sm">
              Comment
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-foreground/60">
            <Link href="/login" className="font-medium text-primary">
              Sign in
            </Link>{" "}
            to leave a comment.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar
                src={comment.profiles?.avatar_url}
                name={comment.profiles?.full_name}
                size={32}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {comment.profiles?.full_name || "A LUIT member"}
                  </p>
                  {user &&
                    (user.id === comment.author_id || user.id === post.creator_id) && (
                      <DeleteCommentButton commentId={comment.id} postId={post.id} />
                    )}
                </div>
                <p className="text-sm text-foreground/70">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
