import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "./actions";

export default async function LoginPage(props: PageProps<"/login">) {
  const { error } = await props.searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sign in to your LUIT account.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
            {error}
          </p>
        )}

        <form action={login} className="mt-8 flex flex-col gap-4">
          <Input label="Email" type="email" name="email" required autoComplete="email" />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
          <Button type="submit">Sign In</Button>
        </form>

        <p className="mt-4 text-sm text-foreground/60">
          <Link href="/forgot-password" className="font-medium text-primary">
            Forgot your password?
          </Link>
        </p>

        <p className="mt-6 text-sm text-foreground/60">
          Don&rsquo;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
