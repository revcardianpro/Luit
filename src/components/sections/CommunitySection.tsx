import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { CreatorPostWithMeta } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";

// Same raw-row shape PostCard's own page deals with — see the comment
// in src/app/community/page.tsx for why the explicit FK hint on
// `profiles` is required here.
interface RawPostRow extends Omit<CreatorPostWithMeta, "like_count" | "comment_count"> {
  creator_post_likes: { count: number }[];
  creator_post_comments: { count: number }[];
}

/**
 * "Community/Impact" from the homepage spec — deliberately not a
 * stats/metrics section (no "500+ members" placeholder numbers: LUIT
 * is genuinely new and doesn't have real usage to report yet, and
 * making numbers up would be dishonest). Shows real, live creator
 * posts instead, with an invitation to join rather than a claim about
 * how big the community already is.
 */
export async function CommunitySection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("creator_posts")
    .select(
      "*, profiles!creator_posts_creator_id_fkey(full_name, avatar_url), creator_post_likes(count), creator_post_comments(count)",
    )
    .order("created_at", { ascending: false })
    .limit(3);

  const posts: CreatorPostWithMeta[] = ((data ?? []) as unknown as RawPostRow[]).map((row) => ({
    ...row,
    like_count: row.creator_post_likes[0]?.count ?? 0,
    comment_count: row.creator_post_comments[0]?.count ?? 0,
  }));

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-lg">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Made by the community
            </h2>
            <p className="mt-2 text-foreground/60">
              LUIT is still young — every photo, post, and listing here comes from a real
              person building it alongside us. Add yours.
            </p>
          </div>
          <Button href="/community/new" variant="outline" size="sm">
            Share Your Work
          </Button>
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 text-foreground/60">
            No posts yet —{" "}
            <Link href="/community/new" className="font-medium text-primary">
              be the first to share something
            </Link>
            .
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-colors hover:border-primary/30"
              >
                <div className="relative aspect-square w-full bg-foreground/5">
                  {post.image_path ? (
                    <Image
                      src={post.image_path}
                      alt={post.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-foreground/40">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-5">
                  <h3 className="font-serif text-base font-semibold">{post.title}</h3>
                  {post.profiles?.full_name && (
                    <p className="text-sm text-foreground/60">by {post.profiles.full_name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
