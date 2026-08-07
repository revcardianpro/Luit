"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // The <Input required> attributes are client-side only — this form
  // can still be submitted directly (or via a crafted request) without
  // them, so the fields' presence has to be checked here too.
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    redirectWithError("/login", "Email and password are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithError("/login", error.message);
  }

  redirect("/");
}
