import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

/**
 * Gate for every /admin/* page. Not signed in -> /login (same as any
 * other auth-gated page); signed in but not an admin -> home, rather
 * than a "you're not allowed" page that would just confirm to a
 * curious visitor that an admin area exists at this URL.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/");
  }

  return user;
}
