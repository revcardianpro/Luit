"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function deleteEvent(formData: FormData) {
  const id = formData.get("id") as string;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id).eq("organizer_id", user.id);

  if (error) {
    redirectWithError(`/events/${id}`, error.message);
  }

  redirect("/events");
}
