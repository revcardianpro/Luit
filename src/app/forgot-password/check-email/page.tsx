export default function ForgotPasswordCheckEmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-3 text-sm text-foreground/60">
          If an account exists for that email, we&rsquo;ve sent a link to reset your
          password. Click it to choose a new one.
        </p>
      </div>
    </main>
  );
}
