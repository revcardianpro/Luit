"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { destinationCategories, type DestinationCategory } from "@/lib/destination-categories";

export async function updateDestination(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const editPath = `/admin/destinations/${id}/edit`;

  const slug = (formData.get("slug") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as string;
  const district = (formData.get("district") as string)?.trim();
  const shortDescription = (formData.get("short_description") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!slug || !name || !category || !district || !shortDescription || !description) {
    redirectWithError(editPath, "Please fill in all fields.");
  }

  if (!destinationCategories.includes(category as DestinationCategory)) {
    redirectWithError(editPath, "Invalid category.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("destinations")
    .update({
      slug,
      name,
      category,
      district,
      short_description: shortDescription,
      description,
    })
    .eq("id", id);

  if (error) {
    redirectWithError(editPath, error.code === "23505" ? "That slug is already in use." : error.message);
  }

  redirect("/admin/destinations");
}
