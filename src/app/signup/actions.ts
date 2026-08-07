"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { redirectWithError } from "@/lib/redirect-with-error";

export async function signup(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    redirectWithError("/signup", "Email and password are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Where Supabase sends the browser after the user clicks the
      // confirmation link in their email. Our /auth/callback route
      // exchanges the code it receives there for a real session.
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    redirectWithError("/signup", error.message);
  }

  redirect("/signup/check-email");
}
