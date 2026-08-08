"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { eventCategories, type EventCategory } from "@/lib/event-categories";
import { toIstIsoString } from "@/lib/format-event-date";

export async function updateEvent(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const editPath = `/events/${id}/edit`;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const location = (formData.get("location") as string) || null;
  const startsAtInput = formData.get("starts_at") as string;
  const endsAtInput = (formData.get("ends_at") as string) || null;
  const externalLink = (formData.get("external_link") as string) || null;
  const imageFile = formData.get("image") as File | null;

  if (!title || !description || !category || !startsAtInput) {
    redirectWithError(editPath, "Please fill in all required fields.");
  }

  if (!eventCategories.includes(category as EventCategory)) {
    redirectWithError(editPath, "Invalid category.");
  }

  const startsAt = toIstIsoString(startsAtInput);
  const endsAt = endsAtInput ? toIstIsoString(endsAtInput) : null;

  if (endsAt && endsAt < startsAt) {
    redirectWithError(editPath, "End time can't be before the start time.");
  }

  const supabase = await createClient();

  let imagePath: string | undefined;
  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      redirectWithError(editPath, "Image must be an image file.");
    }

    const filePath = `${user.id}/${id}`;
    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(filePath, imageFile, { upsert: true, contentType: imageFile.type });

    if (uploadError) {
      redirectWithError(editPath, uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("events").getPublicUrl(filePath);
    imagePath = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description,
      category,
      location,
      starts_at: startsAt,
      ends_at: endsAt,
      external_link: externalLink,
      ...(imagePath ? { image_path: imagePath } : {}),
    })
    .eq("id", id)
    .eq("organizer_id", user.id);

  if (error) {
    redirectWithError(editPath, error.message);
  }

  redirect(`/events/${id}`);
}
