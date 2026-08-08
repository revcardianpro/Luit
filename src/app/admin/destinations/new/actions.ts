"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { destinationCategories, type DestinationCategory } from "@/lib/destination-categories";

export async function createDestination(formData: FormData) {
  await requireAdmin();

  const slug = (formData.get("slug") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as string;
  const district = (formData.get("district") as string)?.trim();
  const shortDescription = (formData.get("short_description") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!slug || !name || !category || !district || !shortDescription || !description) {
    redirectWithError("/admin/destinations/new", "Please fill in all fields.");
  }

  if (!destinationCategories.includes(category as DestinationCategory)) {
    redirectWithError("/admin/destinations/new", "Invalid category.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("destinations").insert({
    slug,
    name,
    category,
    district,
    short_description: shortDescription,
    description,
  });

  if (error) {
    redirectWithError(
      "/admin/destinations/new",
      error.code === "23505" ? "That slug is already in use." : error.message,
    );
  }

  redirect("/admin/destinations");
}
