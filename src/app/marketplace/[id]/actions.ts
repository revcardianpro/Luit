"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function deleteListing(formData: FormData) {
  const id = formData.get("id") as string;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  // The .eq("seller_id", ...) here is belt-and-suspenders -- the RLS
  // delete policy already enforces this server-side regardless.
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("seller_id", user.id);

  if (error) {
    redirectWithError(`/marketplace/${id}`, error.message);
  }

  redirect("/marketplace");
}
