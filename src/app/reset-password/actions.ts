"use server";

import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function resetPassword(formData: FormData) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  if (typeof password !== "string" || typeof confirmPassword !== "string" || !password) {
    redirectWithError("/reset-password", "Please fill in both fields.");
  }

  if (password.length < 6) {
    redirectWithError("/reset-password", "Password must be at least 6 characters.");
  }

  if (password !== confirmPassword) {
    redirectWithError("/reset-password", "Passwords don't match.");
  }

  // Requires the short-lived recovery session /auth/callback just
  // established from the emailed link's code -- with no session,
  // updateUser has nothing to update.
  const user = await getCurrentUser();
  if (!user) {
    redirectWithError("/login", "That reset link has expired. Request a new one.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirectWithError("/reset-password", error.message);
  }

  redirect("/");
}
