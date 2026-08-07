"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Action — runs on the server even though it's triggered from a
 * <form action={signOut}> in the Navbar. Used instead of an API route
 * because Server Actions are the App Router's built-in way to run a
 * server-side mutation from a form without hand-writing a fetch call.
 */
export async function signOut() {
  const supabase = await createClient();
  try {
    await supabase.auth.signOut();
  } catch {
    // A double-submit (e.g. an impatient double-click) can race a
    // session that's already being cleared. Either way the user should
    // land back on a logged-out homepage, not see a raw error.
  }
  redirect("/");
}
