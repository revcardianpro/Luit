import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
import { ProfileForm } from "./ProfileForm";

export default async function AccountPage(props: PageProps<"/account">) {
  const { success, error } = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Your account</h1>
      <p className="mt-2 text-sm text-foreground/60">{user.email}</p>

      {success && (
        <p className="mt-4 rounded-lg bg-brand-green/10 px-3.5 py-2.5 text-sm text-brand-green">
          Profile updated.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
          {error}
        </p>
      )}

      <ProfileForm profile={profile} />
    </main>
  );
}
