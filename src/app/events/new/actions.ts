"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { eventCategories, type EventCategory } from "@/lib/event-categories";
import { toIstIsoString } from "@/lib/format-event-date";

export async function createEvent(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const location = (formData.get("location") as string) || null;
  const startsAtInput = formData.get("starts_at") as string;
  const endsAtInput = (formData.get("ends_at") as string) || null;
  const externalLink = (formData.get("external_link") as string) || null;
  const imageFile = formData.get("image") as File | null;

  if (!title || !description || !category || !startsAtInput) {
    redirectWithError("/events/new", "Please fill in all required fields.");
  }

  if (!eventCategories.includes(category as EventCategory)) {
    redirectWithError("/events/new", "Invalid category.");
  }

  const startsAt = toIstIsoString(startsAtInput);
  const endsAt = endsAtInput ? toIstIsoString(endsAtInput) : null;

  if (endsAt && endsAt < startsAt) {
    redirectWithError("/events/new", "End time can't be before the start time.");
  }

  const supabase = await createClient();
  const eventId = crypto.randomUUID();
  let imagePath: string | null = null;

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      redirectWithError("/events/new", "Image must be an image file.");
    }

    const filePath = `${user.id}/${eventId}`;
    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(filePath, imageFile, { upsert: true, contentType: imageFile.type });

    if (uploadError) {
      redirectWithError("/events/new", uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("events").getPublicUrl(filePath);
    imagePath = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase.from("events").insert({
    id: eventId,
    organizer_id: user.id,
    title,
    description,
    category,
    location,
    starts_at: startsAt,
    ends_at: endsAt,
    external_link: externalLink,
    image_path: imagePath,
  });

  if (error) {
    redirectWithError("/events/new", error.message);
  }

  redirect(`/events/${eventId}`);
}
