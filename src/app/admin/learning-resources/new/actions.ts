"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { learningCategories, type LearningCategory } from "@/lib/learning-categories";

export async function createLearningResource(formData: FormData) {
  await requireAdmin();

  const slug = (formData.get("slug") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const provider = (formData.get("provider") as string)?.trim();
  const category = formData.get("category") as string;
  const shortDescription = (formData.get("short_description") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();

  if (!slug || !title || !provider || !category || !shortDescription || !description || !url) {
    redirectWithError("/admin/learning-resources/new", "Please fill in all fields.");
  }

  if (!learningCategories.includes(category as LearningCategory)) {
    redirectWithError("/admin/learning-resources/new", "Invalid category.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("learning_resources").insert({
    slug,
    title,
    provider,
    category,
    short_description: shortDescription,
    description,
    url,
  });

  if (error) {
    redirectWithError(
      "/admin/learning-resources/new",
      error.code === "23505" ? "That slug is already in use." : error.message,
    );
  }

  redirect("/admin/learning-resources");
}
