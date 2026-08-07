"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { creatorCategories, type CreatorCategory } from "@/lib/creator-categories";

export async function createPost(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const externalLink = (formData.get("external_link") as string) || null;
  const imageFile = formData.get("image") as File | null;

  if (!title || !description || !category) {
    redirectWithError("/community/new", "Please fill in all required fields.");
  }

  if (!creatorCategories.includes(category as CreatorCategory)) {
    redirectWithError("/community/new", "Invalid category.");
  }

  const supabase = await createClient();
  const postId = crypto.randomUUID();
  let imagePath: string | null = null;

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      redirectWithError("/community/new", "Image must be an image file.");
    }

    const filePath = `${user.id}/${postId}`;
    const { error: uploadError } = await supabase.storage
      .from("creator-posts")
      .upload(filePath, imageFile, { upsert: true, contentType: imageFile.type });

    if (uploadError) {
      redirectWithError("/community/new", uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("creator-posts").getPublicUrl(filePath);
    imagePath = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase.from("creator_posts").insert({
    id: postId,
    creator_id: user.id,
    title,
    description,
    category,
    external_link: externalLink,
    image_path: imagePath,
  });

  if (error) {
    redirectWithError("/community/new", error.message);
  }

  redirect(`/community/${postId}`);
}
