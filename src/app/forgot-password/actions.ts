"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    redirectWithError("/forgot-password", "Email is required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Same code-exchange route signup already uses -- /auth/callback
    // just forwards wherever `next` points once the link is verified.
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  });

  // Supabase silently no-ops for an email that isn't registered (so a
  // crafted request can't be used to check who has an account) -- only
  // a genuine failure (rate limit, etc.) surfaces as `error` here.
  if (error) {
    redirectWithError("/forgot-password", error.message);
  }

  redirect("/forgot-password/check-email");
}
