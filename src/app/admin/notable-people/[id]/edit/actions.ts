"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function updateNotablePerson(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const editPath = `/admin/notable-people/${id}/edit`;

  const slug = (formData.get("slug") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const field = (formData.get("field") as string)?.trim();
  const lifespan = (formData.get("lifespan") as string)?.trim();
  const shortDescription = (formData.get("short_description") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const photoCredit = (formData.get("photo_credit") as string)?.trim();
  const photoLicense = (formData.get("photo_license") as string)?.trim();
  const photoLicenseUrl = (formData.get("photo_license_url") as string)?.trim() || null;
  const photoFile = formData.get("photo") as File | null;

  if (
    !slug ||
    !name ||
    !field ||
    !lifespan ||
    !shortDescription ||
    !description ||
    !photoCredit ||
    !photoLicense
  ) {
    redirectWithError(editPath, "Please fill in all required fields.");
  }

  const supabase = await createClient();

  let photoPath: string | undefined;
  if (photoFile && photoFile.size > 0) {
    if (!photoFile.type.startsWith("image/")) {
      redirectWithError(editPath, "Photo must be an image file.");
    }

    const filePath = id;
    const { error: uploadError } = await supabase.storage
      .from("pride-photos")
      .upload(filePath, photoFile, { upsert: true, contentType: photoFile.type });

    if (uploadError) {
      redirectWithError(editPath, uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("pride-photos").getPublicUrl(filePath);
    photoPath = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("notable_people")
    .update({
      slug,
      name,
      field,
      lifespan,
      short_description: shortDescription,
      description,
      photo_credit: photoCredit,
      photo_license: photoLicense,
      photo_license_url: photoLicenseUrl,
      ...(photoPath ? { photo_path: photoPath } : {}),
    })
    .eq("id", id);

  if (error) {
    redirectWithError(editPath, error.code === "23505" ? "That slug is already in use." : error.message);
  }

  redirect("/admin/notable-people");
}
