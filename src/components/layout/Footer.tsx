export function Footer() {
  // Computed rather than hardcoded, so the copyright year never goes
  // stale — no "© 2026" left behind after the calendar turns over.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-10 text-center">
        <span className="text-lg font-semibold tracking-tight">LUIT</span>
        <p className="text-sm text-foreground/60">The Digital Home of Assam</p>
        <p className="mt-4 text-xs text-foreground/50">
          &copy; {year} LUIT. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
