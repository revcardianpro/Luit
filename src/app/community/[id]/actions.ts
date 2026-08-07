"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

// Like/comment actions deliberately don't redirect() -- they stay on
// the same page. Next.js automatically refreshes the current route's
// data after a form-bound Server Action completes, and revalidatePath
// makes sure that refresh actually sees the new row instead of a
// cached one.

export async function toggleLike(formData: FormData) {
  const postId = formData.get("post_id") as string;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("creator_post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("creator_post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase.from("creator_post_likes").insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath(`/community/${postId}`);
  revalidatePath("/community");
}

export async function addComment(formData: FormData) {
  const postId = formData.get("post_id") as string;
  const body = formData.get("body") as string;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (!body || !body.trim()) {
    redirectWithError(`/community/${postId}`, "Comment can't be empty.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("creator_post_comments")
    .insert({ post_id: postId, author_id: user.id, body });

  if (error) {
    redirectWithError(`/community/${postId}`, error.message);
  }

  revalidatePath(`/community/${postId}`);
}

export async function deleteComment(formData: FormData) {
  const commentId = formData.get("comment_id") as string;
  const postId = formData.get("post_id") as string;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // No .eq("author_id", ...) here -- RLS already allows either the
  // comment's author OR the post's owner to delete it, and hardcoding
  // an author-only filter here would silently break the post-owner
  // case.
  const supabase = await createClient();
  const { error } = await supabase.from("creator_post_comments").delete().eq("id", commentId);

  if (error) {
    redirectWithError(`/community/${postId}`, error.message);
  }

  revalidatePath(`/community/${postId}`);
}

export async function deletePost(formData: FormData) {
  const postId = formData.get("id") as string;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("creator_posts")
    .delete()
    .eq("id", postId)
    .eq("creator_id", user.id);

  if (error) {
    redirectWithError(`/community/${postId}`, error.message);
  }

  redirect("/community");
}
