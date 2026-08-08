import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset } from "./actions";

export default async function ForgotPasswordPage(props: PageProps<"/forgot-password">) {
  const { error } = await props.searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Enter your account email and we&rsquo;ll send you a link to set a new password.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
            {error}
          </p>
        )}

        <form action={requestPasswordReset} className="mt-8 flex flex-col gap-4">
          <Input label="Email" type="email" name="email" required autoComplete="email" />
          <Button type="submit">Send reset link</Button>
        </form>

        <p className="mt-6 text-sm text-foreground/60">
          <Link href="/login" className="font-medium text-primary">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
