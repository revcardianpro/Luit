import Link from "next/link";
import Image from "next/image";
import type { CreatorPostWithMeta } from "@/lib/supabase/types";
import { getCreatorCategoryAccent } from "@/lib/creator-categories";
import { accentBgClass } from "@/lib/brand-accent";

export function PostCard({ post }: { post: CreatorPostWithMeta }) {
  const accent = getCreatorCategoryAccent(post.category);

  return (
    <Link
      href={`/community/${post.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-colors hover:border-foreground/20"
    >
      <div className="relative aspect-square w-full bg-foreground/5">
        {post.image_path ? (
          <Image
            src={post.image_path}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-foreground/40">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <span className={`h-2 w-10 rounded-full ${accentBgClass[accent]}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {post.category}
        </p>
        <h3 className="font-serif text-xl font-semibold">{post.title}</h3>
        {post.profiles?.full_name && (
          <p className="text-sm text-foreground/60">by {post.profiles.full_name}</p>
        )}
        <p className="text-sm text-foreground/50">
          ♥ {post.like_count} · {post.comment_count} comment
          {post.comment_count === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}
