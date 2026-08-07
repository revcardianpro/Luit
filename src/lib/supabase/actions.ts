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
  await supabase.auth.signOut();
  redirect("/");
}
