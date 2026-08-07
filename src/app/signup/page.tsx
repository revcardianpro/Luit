import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signup } from "./actions";

export default async function SignupPage(props: PageProps<"/signup">) {
  const { error } = await props.searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-foreground/60">Join LUIT.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
            {error}
          </p>
        )}

        <form action={signup} className="mt-8 flex flex-col gap-4">
          <Input label="Email" type="email" name="email" required autoComplete="email" />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button type="submit">Sign Up</Button>
        </form>

        <p className="mt-6 text-sm text-foreground/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
