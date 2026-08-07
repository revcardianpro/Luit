import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/lib/navigation";

/**
 * Site header, rendered once in the root layout so it appears on every
 * page. `sticky top-0` keeps it pinned while scrolling; the translucent
 * `bg-background/80 backdrop-blur` keeps content readable underneath it
 * without needing a hard, opaque bar.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          LUIT
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" disabled>
            Sign In
          </Button>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
