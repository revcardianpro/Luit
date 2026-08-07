"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { creatorCategories, type CreatorCategory } from "@/lib/creator-categories";

export async function updatePost(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const editPath = `/community/${id}/edit`;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const externalLink = (formData.get("external_link") as string) || null;
  const imageFile = formData.get("image") as File | null;

  if (!title || !description || !category) {
    redirectWithError(editPath, "Please fill in all required fields.");
  }

  if (!creatorCategories.includes(category as CreatorCategory)) {
    redirectWithError(editPath, "Invalid category.");
  }

  const supabase = await createClient();

  let imagePath: string | undefined;
  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      redirectWithError(editPath, "Image must be an image file.");
    }

    const filePath = `${user.id}/${id}`;
    const { error: uploadError } = await supabase.storage
      .from("creator-posts")
      .upload(filePath, imageFile, { upsert: true, contentType: imageFile.type });

    if (uploadError) {
      redirectWithError(editPath, uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("creator-posts").getPublicUrl(filePath);
    imagePath = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("creator_posts")
    .update({
      title,
      description,
      category,
      external_link: externalLink,
      ...(imagePath ? { image_path: imagePath } : {}),
    })
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) {
    redirectWithError(editPath, error.message);
  }

  redirect(`/community/${id}`);
}
