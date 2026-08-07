"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function deleteJob(formData: FormData) {
  const id = formData.get("id") as string;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("jobs").delete().eq("id", id).eq("poster_id", user.id);

  if (error) {
    redirectWithError(`/jobs/${id}`, error.message);
  }

  redirect("/jobs");
}
