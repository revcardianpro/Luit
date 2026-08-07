"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { marketplaceCategories, type MarketplaceCategory } from "@/lib/marketplace-categories";

export async function updateListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const editPath = `/marketplace/${id}/edit`;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const priceRaw = formData.get("price") as string;
  const district = (formData.get("district") as string) || null;
  const contactEmail = (formData.get("contact_email") as string) || null;
  const contactPhone = (formData.get("contact_phone") as string) || null;
  const imageFile = formData.get("image") as File | null;

  if (!title || !description || !category || !priceRaw) {
    redirectWithError(editPath, "Please fill in all required fields.");
  }

  if (!marketplaceCategories.includes(category as MarketplaceCategory)) {
    redirectWithError(editPath, "Invalid category.");
  }

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    redirectWithError(editPath, "Please enter a valid price.");
  }

  if (!contactEmail && !contactPhone) {
    redirectWithError(editPath, "Provide at least one contact method (email or phone).");
  }

  const supabase = await createClient();

  let imagePath: string | undefined;
  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      redirectWithError(editPath, "Photo must be an image file.");
    }

    const filePath = `${user.id}/${id}`;
    const { error: uploadError } = await supabase.storage
      .from("listings")
      .upload(filePath, imageFile, { upsert: true, contentType: imageFile.type });

    if (uploadError) {
      redirectWithError(editPath, uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("listings").getPublicUrl(filePath);
    imagePath = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("products")
    .update({
      title,
      description,
      category,
      price,
      district,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      ...(imagePath ? { image_path: imagePath } : {}),
    })
    .eq("id", id)
    .eq("seller_id", user.id);

  if (error) {
    redirectWithError(editPath, error.message);
  }

  redirect(`/marketplace/${id}`);
}
