"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function deleteNotablePerson(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;

  const supabase = await createClient();
  const { error } = await supabase.from("notable_people").delete().eq("id", id);

  if (error) {
    redirectWithError("/admin/notable-people", error.message);
  }

  redirect("/admin/notable-people");
}
