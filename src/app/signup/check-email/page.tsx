export default function CheckEmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-3 text-sm text-foreground/60">
          We&rsquo;ve sent a confirmation link to your inbox. Click it to activate
          your account, then come back and sign in.
        </p>
      </div>
    </main>
  );
}
