import { getCurrentUser } from "@/lib/supabase/server";
import { redirectWithError } from "@/lib/redirect-with-error";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { resetPassword } from "./actions";

export default async function ResetPasswordPage(props: PageProps<"/reset-password">) {
  const { error } = await props.searchParams;

  // Only reachable with a valid recovery session, established by
  // /auth/callback from the emailed link's code just before landing
  // here. No session means an expired or already-used link.
  const user = await getCurrentUser();
  if (!user) {
    redirectWithError("/login", "That reset link has expired. Request a new one.");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Setting a new password for {user.email}.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
            {error}
          </p>
        )}

        <form action={resetPassword} className="mt-8 flex flex-col gap-4">
          <Input
            label="New password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Input
            label="Confirm new password"
            type="password"
            name="confirm_password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button type="submit">Set new password</Button>
        </form>
      </div>
    </main>
  );
}
