"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { marketplaceCategories, type MarketplaceCategory } from "@/lib/marketplace-categories";

export async function createListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const priceRaw = formData.get("price") as string;
  const district = (formData.get("district") as string) || null;
  const contactEmail = (formData.get("contact_email") as string) || null;
  const contactPhone = (formData.get("contact_phone") as string) || null;
  const imageFile = formData.get("image") as File | null;

  if (!title || !description || !category || !priceRaw) {
    redirectWithError("/marketplace/new", "Please fill in all required fields.");
  }

  if (!marketplaceCategories.includes(category as MarketplaceCategory)) {
    redirectWithError("/marketplace/new", "Invalid category.");
  }

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    redirectWithError("/marketplace/new", "Please enter a valid price.");
  }

  if (!contactEmail && !contactPhone) {
    redirectWithError("/marketplace/new", "Provide at least one contact method (email or phone).");
  }

  const supabase = await createClient();

  // Generated up front (rather than left to the DB default) so the
  // image can live at a path derived from it, matching the fixed-path-
  // with-upsert pattern used for avatars -- re-uploading on a future
  // edit overwrites the same object instead of accumulating orphans.
  const listingId = crypto.randomUUID();
  let imagePath: string | null = null;

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      redirectWithError("/marketplace/new", "Photo must be an image file.");
    }

    const filePath = `${user.id}/${listingId}`;
    const { error: uploadError } = await supabase.storage
      .from("listings")
      .upload(filePath, imageFile, { upsert: true, contentType: imageFile.type });

    if (uploadError) {
      redirectWithError("/marketplace/new", uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("listings").getPublicUrl(filePath);
    imagePath = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase.from("products").insert({
    id: listingId,
    seller_id: user.id,
    title,
    description,
    category,
    price,
    district,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    image_path: imagePath,
  });

  if (error) {
    redirectWithError("/marketplace/new", error.message);
  }

  redirect(`/marketplace/${listingId}`);
}
