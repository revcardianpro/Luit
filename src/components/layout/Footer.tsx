import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/navigation";

export function Footer() {
  // Computed rather than hardcoded, so the copyright year never goes
  // stale — no "© 2026" left behind after the calendar turns over.
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 bg-gradient-to-b from-transparent to-primary/[0.03]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3">
          <Image src="/luit-logo-navbar.png" alt="LUIT" width={1326} height={530} className="h-8 w-auto" />
          <p className="max-w-xs text-sm text-foreground/60">
            The digital home of Assam — modern technology with an Assamese soul.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.15em] text-foreground/40 uppercase">
            Explore
          </span>
          <nav className="flex flex-col gap-2">
            {navLinks
              .filter((link) => link.href !== "/#pillars")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/70 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.15em] text-foreground/40 uppercase">
            Account
          </span>
          <nav className="flex flex-col gap-2">
            <Link href="/login" className="text-sm text-foreground/70 hover:text-primary">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm text-foreground/70 hover:text-primary">
              Sign Up
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-foreground/10 px-6 py-6">
        <p className="mx-auto max-w-5xl text-center text-xs text-foreground/50">
          &copy; {year} LUIT. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
